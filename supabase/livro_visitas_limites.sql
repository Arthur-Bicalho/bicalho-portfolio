-- =============================================================================
-- Livro de Visitas: limites de tamanho e de frequência (comando `guestbook`)
--
-- Rode no Supabase DEPOIS do livro_visitas.sql: SQL Editor → New query →
-- cole tudo → Run. Não selecione um trecho: com texto selecionado, o Run
-- executa só a seleção. Pode rodar de novo sem medo: não apaga mensagens.
--
-- Por quê: a publishable key do Supabase é pública (vai no bundle do site, e
-- isso é normal), então qualquer um consegue chamar a API direto, sem passar
-- pelo formulário. Os limites do front (maxLength) são só conforto: quem
-- protege de verdade é o banco, aqui.
--
-- Usado por: src/components/LivroVisitas.jsx (traduz os erros abaixo)
-- =============================================================================

-- 1. Tamanho: nome com 1–50 e mensagem com 1–500 caracteres, sem contar os
--    espaços das pontas. `not valid` porque as mensagens antigas não são
--    conferidas (uma antiga maior que o limite não impede o script de rodar);
--    as novas, sim.
alter table public.guestbook_messages
  drop constraint if exists guestbook_nome_tamanho;
alter table public.guestbook_messages
  add constraint guestbook_nome_tamanho
  check (char_length(trim(name)) between 1 and 50) not valid;

alter table public.guestbook_messages
  drop constraint if exists guestbook_mensagem_tamanho;
alter table public.guestbook_messages
  add constraint guestbook_mensagem_tamanho
  check (char_length(trim(message)) between 1 and 500) not valid;

-- 2. Índice para contar as mensagens recentes sem varrer a tabela
create index if not exists guestbook_messages_created_at_idx
  on public.guestbook_messages (created_at desc);

-- 3. Frequência: no máximo 5 mensagens por minuto e 200 por dia, somando
--    todos os visitantes (o banco não sabe o IP de quem chama). Quem passa do
--    limite recebe o erro PT429: o PostgREST devolve HTTP 429 e o site mostra
--    "muitas mensagens agora, tente daqui a pouco".
--
--    O created_at é sempre o relógio do banco: sem isso, alguém poderia
--    gravar com uma data antiga e escapar da contagem.
create or replace function public.guestbook_limite_envios()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  no_minuto int;
  no_dia int;
begin
  new.created_at := now();
  new.name := trim(new.name);
  new.message := trim(new.message);

  -- Um envio por vez: dois inserts ao mesmo tempo não passam juntos do limite
  perform pg_advisory_xact_lock(hashtext('guestbook_messages'));

  select count(*) into no_minuto
    from public.guestbook_messages
   where created_at > now() - interval '1 minute';
  if no_minuto >= 5 then
    raise exception 'Limite de mensagens por minuto atingido. Tente de novo daqui a pouco.'
      using errcode = 'PT429', hint = 'limite_minuto';
  end if;

  select count(*) into no_dia
    from public.guestbook_messages
   where created_at > now() - interval '24 hours';
  if no_dia >= 200 then
    raise exception 'Limite diário de mensagens atingido. Tente de novo amanhã.'
      using errcode = 'PT429', hint = 'limite_dia';
  end if;

  return new;
end;
$$;

revoke all on function public.guestbook_limite_envios() from public, anon, authenticated;

drop trigger if exists guestbook_limite_envios on public.guestbook_messages;
create trigger guestbook_limite_envios
before insert on public.guestbook_messages
for each row execute function public.guestbook_limite_envios();

-- 4. O insert público continua liberado (livro_visitas.sql), mas agora com os
--    limites acima. Sem update e delete para o visitante, como antes.
