-- =============================================================================
-- Recados anônimos (comando `recado`)
--
-- Rode no Supabase: SQL Editor → New query → cole tudo → Run.
-- Não selecione um trecho: com texto selecionado, o Run executa só a seleção.
-- Pode rodar de novo sem medo: não apaga recados.
--
-- Usado por: src/components/Recado.jsx (só grava)
--
-- Só você lê: o visitante tem permissão de inserir e mais nada (nem ler o
-- próprio recado). Para ler, use o Table Editor do Supabase (tabela
-- "recados") ou o SQL Editor:
--   select texto, created_at from public.recados order by created_at desc;
-- =============================================================================

-- 1. Tabela. Nada identifica quem escreveu: sem nome, e-mail ou IP
create table if not exists public.recados (
  id uuid primary key default gen_random_uuid(),
  texto text not null check (char_length(texto) between 1 and 280),
  created_at timestamptz not null default now()
);
create index if not exists recados_created_at_idx on public.recados (created_at desc);

-- 2. RLS: só insert para o visitante. Sem select, update nem delete
alter table public.recados enable row level security;

drop policy if exists "Allow anonymous insert" on public.recados;
create policy "Allow anonymous insert"
on public.recados
for insert
to anon
with check (true);

-- 3. Antes de gravar: tira os espaços das pontas, usa o relógio do banco e
--    confere a frequência (no máximo 5 recados por minuto e 100 por dia,
--    somando todos os visitantes; erro PT429, que vira HTTP 429)
create or replace function public.recados_antes_de_gravar()
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
  new.created_at := now();
  new.texto := trim(new.texto);

  perform pg_advisory_xact_lock(hashtext('recados'));

  select count(*) into no_minuto
    from public.recados
   where created_at > now() - interval '1 minute';
  if no_minuto >= 5 then
    raise exception 'Muitos recados agora. Tente de novo daqui a pouco.'
      using errcode = 'PT429', hint = 'limite_minuto';
  end if;

  select count(*) into no_dia
    from public.recados
   where created_at > now() - interval '24 hours';
  if no_dia >= 100 then
    raise exception 'Limite diário de recados atingido. Tente de novo amanhã.'
      using errcode = 'PT429', hint = 'limite_dia';
  end if;

  return new;
end;
$$;

revoke all on function public.recados_antes_de_gravar() from public, anon, authenticated;

drop trigger if exists recados_antes_de_gravar on public.recados;
create trigger recados_antes_de_gravar
before insert on public.recados
for each row execute function public.recados_antes_de_gravar();
