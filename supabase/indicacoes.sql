-- =============================================================================
-- Indicações de música (comando `indicar`)
--
-- Rode no Supabase: SQL Editor → New query → cole tudo → Run.
-- Não selecione um trecho: com texto selecionado, o Run executa só a seleção.
-- Pode rodar de novo sem medo: não apaga indicações nem desfaz aprovações.
--
-- Usado por: src/components/Indicar.jsx (lê as aprovadas e grava)
--
-- Toda indicação chega pendente (aprovado = false) e só aparece no site
-- depois que você aprovar. Para ver as pendentes e aprovar:
--   select id, artista, musica, nome, created_at
--     from public.indicacoes where not aprovado order by created_at;
--   update public.indicacoes set aprovado = true where id = '<id>';
-- (ou marque a coluna "aprovado" no Table Editor). Para recusar, apague a linha.
-- =============================================================================

-- 1. Tabela. Música e nome são opcionais (null quando vazios)
create table if not exists public.indicacoes (
  id uuid primary key default gen_random_uuid(),
  artista text not null check (char_length(artista) between 1 and 60),
  musica text check (musica is null or char_length(musica) between 1 and 80),
  nome text check (nome is null or char_length(nome) between 1 and 30),
  aprovado boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists indicacoes_aprovadas_idx
  on public.indicacoes (created_at desc) where aprovado;
create index if not exists indicacoes_created_at_idx on public.indicacoes (created_at desc);

-- 2. RLS: o visitante lê só as aprovadas e insere só pendentes. Sem update
--    nem delete: aprovar é com você, no painel ou no SQL Editor
alter table public.indicacoes enable row level security;

drop policy if exists "Allow public read approved" on public.indicacoes;
create policy "Allow public read approved"
on public.indicacoes
for select
to anon, authenticated
using (aprovado);

drop policy if exists "Allow anonymous insert pending" on public.indicacoes;
create policy "Allow anonymous insert pending"
on public.indicacoes
for insert
to anon
with check (aprovado = false);

-- 3. Antes de gravar: força pendente (quem mandar aprovado = true pela API
--    grava pendente do mesmo jeito; a política do item 2 confere depois do
--    trigger, como segunda trava), limpa os textos, usa o
--    relógio do banco e confere a frequência: no máximo 5 por minuto e 100
--    por dia, somando todos os visitantes (erro PT429, que vira HTTP 429)
create or replace function public.indicacoes_antes_de_gravar()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  no_minuto int;
  no_dia int;
begin
  new.id := gen_random_uuid();
  new.aprovado := false;
  new.created_at := now();
  new.artista := trim(new.artista);
  new.musica := nullif(trim(coalesce(new.musica, '')), '');
  new.nome := nullif(trim(coalesce(new.nome, '')), '');

  perform pg_advisory_xact_lock(hashtext('indicacoes'));

  select count(*) into no_minuto
    from public.indicacoes
   where created_at > now() - interval '1 minute';
  if no_minuto >= 5 then
    raise exception 'Muitas indicações agora. Tente de novo daqui a pouco.'
      using errcode = 'PT429', hint = 'limite_minuto';
  end if;

  select count(*) into no_dia
    from public.indicacoes
   where created_at > now() - interval '24 hours';
  if no_dia >= 100 then
    raise exception 'Limite diário de indicações atingido. Tente de novo amanhã.'
      using errcode = 'PT429', hint = 'limite_dia';
  end if;

  return new;
end;
$$;

revoke all on function public.indicacoes_antes_de_gravar() from public, anon, authenticated;

drop trigger if exists indicacoes_antes_de_gravar on public.indicacoes;
create trigger indicacoes_antes_de_gravar
before insert on public.indicacoes
for each row execute function public.indicacoes_antes_de_gravar();
