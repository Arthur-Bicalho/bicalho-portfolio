-- =============================================================================
-- CTF (comando `ctf`): conferência da flag e placar
--
-- Rode no Supabase: SQL Editor → New query → cole tudo → Run.
-- Não selecione um trecho: com texto selecionado, o Run executa só a seleção.
-- Pode rodar de novo sem medo: não apaga o placar nem troca o hash salvo.
--
-- Usado por: src/components/Ctf.jsx (lê o placar e chama ctf_enviar)
--
-- A flag nunca fica no site nem neste arquivo: aqui só vai o SHA-256 dela.
-- O visitante manda o que achou para ctf_enviar, e a comparação acontece no
-- banco. Para trocar a flag:
--   update public.ctf_config
--      set flag_sha256 = encode(extensions.digest('<flag nova>', 'sha256'), 'hex')
--    where id = 1;
-- (rode só no SQL Editor; não salve a flag nova em nenhum arquivo do repositório)
-- =============================================================================

-- 1. pgcrypto: o digest() que calcula o SHA-256
create extension if not exists pgcrypto with schema extensions;

-- 2. Hash da flag. Sem política de RLS: o visitante não lê nem grava
create table if not exists public.ctf_config (
  id int primary key check (id = 1),
  flag_sha256 text not null check (flag_sha256 ~ '^[0-9a-f]{64}$')
);
alter table public.ctf_config enable row level security;

insert into public.ctf_config (id, flag_sha256)
values (1, '048af2c139401d5466faa34674cb8feb2ec21250c2173aa5ff8dd53f2c7b381c')
on conflict (id) do nothing;

-- 3. Tentativas (só para o limite de frequência). Sem política: ninguém lê
create table if not exists public.ctf_tentativas (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now()
);
alter table public.ctf_tentativas enable row level security;
create index if not exists ctf_tentativas_created_at_idx
  on public.ctf_tentativas (created_at desc);

-- 4. Placar: leitura pública; só a função ctf_enviar grava
create table if not exists public.ctf_placar (
  id bigint generated always as identity primary key,
  nome text not null check (char_length(nome) between 1 and 30),
  created_at timestamptz not null default now()
);
alter table public.ctf_placar enable row level security;
create unique index if not exists ctf_placar_nome_unico
  on public.ctf_placar (lower(nome));
create index if not exists ctf_placar_created_at_idx
  on public.ctf_placar (created_at);

drop policy if exists "Allow public read" on public.ctf_placar;
create policy "Allow public read"
on public.ctf_placar
for select
to anon, authenticated
using (true);

-- 5. ctf_enviar(flag, nome): confere a flag e, se acertou, põe o nome no placar.
--    Devolve { "ok": true|false, "posicao": n, "repetido": true|false }.
--
--    Limites (somando todos os visitantes, porque o banco não sabe o IP):
--    30 tentativas por minuto e 2000 por dia (erro PT429, que o PostgREST
--    devolve como HTTP 429) e 50 nomes novos no placar por dia. Tamanhos:
--    flag até 100 e nome de 1 a 30 caracteres (erro 22023).
--
--    security definer: roda com o dono da função, então o visitante confere
--    a flag sem conseguir ler o hash nem gravar no placar direto.
create or replace function public.ctf_enviar(flag text, nome text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  nome_limpo text := trim(coalesce(nome, ''));
  no_minuto int;
  no_dia int;
  novos_hoje int;
  ja bigint;
  pos int;
begin
  if flag is null or char_length(flag) > 100 then
    raise exception 'Flag inválida.' using errcode = '22023', hint = 'tamanho_flag';
  end if;
  if char_length(nome_limpo) not between 1 and 30 then
    raise exception 'O nome precisa ter de 1 a 30 caracteres.'
      using errcode = '22023', hint = 'tamanho_nome';
  end if;

  -- Uma tentativa por vez: duas ao mesmo tempo não passam juntas do limite
  perform pg_advisory_xact_lock(hashtext('ctf_enviar'));

  select count(*) into no_minuto
    from public.ctf_tentativas
   where created_at > now() - interval '1 minute';
  if no_minuto >= 30 then
    raise exception 'Muitas tentativas agora. Tente de novo daqui a pouco.'
      using errcode = 'PT429', hint = 'limite_minuto';
  end if;

  select count(*) into no_dia
    from public.ctf_tentativas
   where created_at > now() - interval '24 hours';
  if no_dia >= 2000 then
    raise exception 'Limite diário de tentativas atingido. Tente de novo amanhã.'
      using errcode = 'PT429', hint = 'limite_dia';
  end if;

  insert into public.ctf_tentativas default values;

  -- Tentativas com mais de 2 dias não servem para nada: limpa
  delete from public.ctf_tentativas where created_at < now() - interval '2 days';

  if encode(digest(trim(flag), 'sha256'), 'hex')
     is distinct from (select flag_sha256 from public.ctf_config where id = 1) then
    return jsonb_build_object('ok', false);
  end if;

  -- Acertou. Nome que já está no placar não entra de novo
  select p.id into ja from public.ctf_placar p where lower(p.nome) = lower(nome_limpo);
  if found then
    select count(*) into pos from public.ctf_placar p where p.id <= ja;
    return jsonb_build_object('ok', true, 'posicao', pos, 'repetido', true);
  end if;

  select count(*) into novos_hoje
    from public.ctf_placar
   where created_at > now() - interval '24 hours';
  if novos_hoje >= 50 then
    raise exception 'O placar já recebeu muitos nomes hoje. Tente de novo amanhã.'
      using errcode = 'PT429', hint = 'limite_placar';
  end if;

  insert into public.ctf_placar (nome) values (nome_limpo);
  select count(*) into pos from public.ctf_placar;
  return jsonb_build_object('ok', true, 'posicao', pos, 'repetido', false);
end;
$$;

revoke all on function public.ctf_enviar(text, text) from public;
grant execute on function public.ctf_enviar(text, text) to anon, authenticated;
