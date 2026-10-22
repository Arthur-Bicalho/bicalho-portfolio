-- =============================================================================
-- Ranking de comandos (comando `ranking`)
--
-- Rode no Supabase: SQL Editor → New query → cole tudo → Run.
-- Não selecione um trecho: com texto selecionado, o Run executa só a seleção.
-- Pode rodar de novo sem medo: não zera os totais. Rode de novo sempre que um
-- comando novo entrar na lista de registrar_comando (item 3).
--
-- Usado por: src/lib/ranking.js (soma) e src/components/Ranking.jsx (lê)
--
-- Privacidade: só se guarda quantas vezes cada comando rodou. Nada de IP,
-- sessão, horário por visitante ou o texto digitado depois do comando.
-- =============================================================================

-- 1. Total por comando. Leitura pública; ninguém grava direto
create table if not exists public.ranking_comandos (
  nome text primary key check (char_length(nome) between 1 and 30),
  total bigint not null default 0 check (total >= 0)
);
alter table public.ranking_comandos enable row level security;

drop policy if exists "Allow public read" on public.ranking_comandos;
create policy "Allow public read"
on public.ranking_comandos
for select
to anon, authenticated
using (true);

-- 2. Chamadas por minuto (só para o limite de frequência). Sem política:
--    ninguém lê nem grava direto
create table if not exists public.ranking_chamadas (
  minuto timestamptz primary key,
  total int not null default 0
);
alter table public.ranking_chamadas enable row level security;

-- 3. registrar_comando(nome): soma 1 ao comando, se ele estiver na lista.
--    O site chama no máximo uma vez por comando por sessão (lib/ranking.js),
--    mas o banco não confia nisso: aceita no máximo 300 chamadas por minuto e
--    20000 por dia, somando todos os visitantes (erro PT429, HTTP 429).
--    Nome fora da lista é ignorado em silêncio (não vira linha nova).
create or replace function public.registrar_comando(nome text)
returns void
language plpgsql
security definer
set search_path = public
as $$
-- "nome" é o parâmetro (a API chama com { nome }) e também uma coluna: nas
-- consultas vale a coluna, e o parâmetro aparece como registrar_comando.nome
#variable_conflict use_column
declare
  permitidos constant text[] := array[
    'sobre', 'pergunta', 'ajuda', 'contato', 'curriculo', 'lattes',
    'habilidades', 'tema', 'projetos', 'github', 'spotify', 'stats',
    'neofetch', 'campeonato', 'basquete', 'jogo', 'guestbook', 'design',
    'hack', 'ctf', 'cifra', 'whoami',
    'ranking', 'agora',
    'recado', 'indicar',
    'mapa', 'traduzir', 'deutsch', 'quiz',
    'digitar', 'rm', 'compartilhar'
  ];
  agora_min timestamptz := date_trunc('minute', now());
  no_minuto int;
  no_dia int;
begin
  if registrar_comando.nome is null or not (registrar_comando.nome = any (permitidos)) then
    return;
  end if;

  insert into public.ranking_chamadas as c (minuto, total)
  values (agora_min, 1)
  on conflict (minuto) do update set total = c.total + 1
  returning c.total into no_minuto;
  if no_minuto > 300 then
    raise exception 'Muitos comandos agora. Tente de novo daqui a pouco.'
      using errcode = 'PT429', hint = 'limite_minuto';
  end if;

  select coalesce(sum(total), 0) into no_dia
    from public.ranking_chamadas
   where minuto > now() - interval '24 hours';
  if no_dia > 20000 then
    raise exception 'Limite diário do ranking atingido.'
      using errcode = 'PT429', hint = 'limite_dia';
  end if;

  -- Minutos com mais de 2 dias não servem para nada: limpa
  delete from public.ranking_chamadas where minuto < now() - interval '2 days';

  insert into public.ranking_comandos as r (nome, total)
  values (registrar_comando.nome, 1)
  on conflict (nome) do update set total = r.total + 1;
end;
$$;

revoke all on function public.registrar_comando(text) from public;
grant execute on function public.registrar_comando(text) to anon, authenticated;
