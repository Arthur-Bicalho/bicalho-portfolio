# Portfólio Terminal · Arthur Bicalho Angelo

Meu portfólio pessoal: um site em React + Vite que imita um terminal Linux.
O visitante navega digitando comandos (`ajuda` lista todos).

Estudante de Ciência da Computação na PUC Minas e membro da
[WebTech](https://webtech.network/), empresa júnior de tecnologia da PUC Minas.

- GitHub: [github.com/Arthur-Bicalho](https://github.com/Arthur-Bicalho)
- E-mail: arthurbangelo@gmail.com

## Comandos

| Comando | O que faz |
| --- | --- |
| `sobre` / `about` | Quem sou: o que faço hoje, formação e um pouco de mim fora do terminal |
| `pergunta` / `ask` | Uma IA (Google Gemini) responde perguntas sobre mim |
| `habilidades` / `skills` | Linguagens e ferramentas (`--terminal`, `--cards`, `--lista`, `--globo`) |
| `projetos` / `projects` | Meus projetos |
| `github` | Meus repositórios, pela GitHub API |
| `stats` | Estatísticas do GitHub (`--resumo`, `--linguagens`, `--atividade`, `--horarios`, `--repos`, `--tudo`) |
| `lattes` | Meu Currículo Lattes (`--pdf` baixa o PDF) |
| `curriculo` / `resume` | Currículo em PDF |
| `contato` / `contact` | Formulário de contato (EmailJS) e redes |
| `spotify` | O que estou ouvindo |
| `guestbook` | Livro de visitas (Supabase) |
| `neofetch` | Informações do "sistema" |
| `campeonato` / `galo` | Próximos jogos do Atlético Mineiro |
| `basquete` / `nba` | Próximos jogos da NBA |
| `jogo` / `quake` / `flappyplane` | Quake (shareware) e Flappy Plane |
| `tema` | Tema escuro, claro ou Galo |
| `design` | Design system do portfólio |
| `limpar` / `clear` | Limpa o terminal |

O `ajuda` mostra a tabela acima e, embaixo, uma linha por categoria com os comandos dela.
`ajuda --tudo` (`help --all`) mostra todos com a descrição.

**Segurança**

| Comando | O que faz |
| --- | --- |
| `hack` / `breach` | Minigame breach protocol (`--facil`, `--dificil`); vencer acende "ACCESS GRANTED" no HUD |
| `ctf` / `flag` | Capture the flag: pistas, placar (`--placar`) e envio (`--enviar` ou `ctf <flag>`) |
| `cifra` / `cipher` | `cifra <texto>`: César, ROT13, Vigenère, Base64, hex e SHA-256 ao vivo (`--decodificar`) |
| `whoami` | O que qualquer site sabe sobre você sem pedir permissão, com dicas de privacidade |

**Dados**

| Comando | O que faz |
| --- | --- |
| `ranking` / `top` | Os comandos mais usados pelos visitantes, num gráfico de barras em caracteres |
| `agora` / `now` | O que estou estudando e construindo (`src/data/agoraData.js`) e o último push público |
| `galo --stats` | Aproveitamento do Galo na temporada: gols, saldo, últimos 10 jogos e gols por jogo |

O `ranking` conta cada comando no máximo uma vez por visita e envia só o nome dele, sem IP nem
identificação. O banco aceita só os nomes da lista em `registrar_comando` e limita a frequência.

Links diretos: `?cmd=sobre` abre o site já rodando um comando e `?lang=en` abre em inglês.

## Visual (HUD netrunner)

O terminal fica no meio de um HUD inspirado em Cyberpunk e Neuromancer (`src/hud`):

- **Cabeçalho** `NET//RUNNER` com distrito, nó e sessão.
- **Painel esquerdo**: perfil (foto, handle, classe, facção) e "cyberware instalado" (as habilidades de `src/data/skillsMeta.js`).
- **Painel direito**: breach protocol (decorativo) e "gigs", atalhos que rodam comandos no terminal.
- **Taskbar retrô**: o botão `>_ BICALHO` roda `ajuda`, `terminal.exe` volta o foco para o terminal, os últimos 3 comandos viram botões, o ticker mostra curiosidades e a bandeja tem tema, idioma e relógio.
- **Loader retrô**: a janela "System message" com barra em blocos aparece enquanto um comando carrega.

Tudo cabe numa tela (só o terminal rola). Abaixo de 1180 px os painéis laterais somem; no celular a taskbar fica compacta. As cores vêm dos tokens `--hud-*` em `src/theme/theme.css`, nos temas escuro, claro e galo. O HUD soma ~3 kB (gzip) ao carregamento inicial, mais a fonte Rajdhani (16 kB).

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # opcional: chaves do EmailJS, Supabase, Gemini...
npm run dev
```

Todas as variáveis do `.env.example` são opcionais: sem elas o site abre normalmente
e os comandos que dependem delas avisam que ainda não estão configurados.

## Publicando na Vercel

1. Suba este repositório para o seu GitHub e importe o projeto na Vercel (framework: Vite).
2. Em *Settings → Environment Variables*, crie as mesmas variáveis do `.env.local`.
3. Troque `arthur-bicalho.vercel.app` em `index.html` pelo endereço que a Vercel der ao projeto.

### Cabeçalhos de segurança

O `vercel.json` manda em todas as rotas uma `Content-Security-Policy` que libera só as origens
que o site usa, além de `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` e
`Permissions-Policy`. O `npm run preview` aplica os mesmos cabeçalhos (lidos do `vercel.json`),
então dá para testar o build com a CSP de verdade. Ao usar um serviço externo novo (API, imagem,
iframe), acrescente a origem na diretiva certa da CSP. Ao mudar o script inline do `index.html`,
gere o hash de novo (o comando está em `vite.config.js`).

## O que ainda falta configurar

Contas e chaves (vão nas variáveis de ambiente da Vercel; veja o `.env.example`):

- **EmailJS** para o formulário do `contato`. O e-mail de confirmação para quem escreveu fica
  **desligado** por padrão (`VITE_EMAILJS_CONFIRMACAO=false`): ele iria para qualquer endereço
  digitado, e alguém poderia usar o site para mandar e-mails a terceiros pela sua conta. Ligue com
  `VITE_EMAILJS_CONFIRMACAO=true` só com o reCAPTCHA conferido no template de confirmação.
  O formulário também deixa um envio a cada 60 s por navegador (só cortesia; quem protege é o reCAPTCHA).
- **Supabase** para o `guestbook` e o contador de visitas. Rode os arquivos de `supabase/` no
  SQL Editor, nesta ordem:
  1. `contador_visitas.sql`
  2. `livro_visitas.sql`
  3. `livro_visitas_limites.sql` (nome de 1–50 e mensagem de 1–500 caracteres; no máximo 5
     mensagens por minuto e 200 por dia, conferidos no próprio banco)
  4. `ctf.sql` (placar e conferência da flag do `ctf`, veja abaixo)
  5. `ranking_comandos.sql` (ranking de comandos). Ao criar um comando novo, acrescente o nome
     na lista `permitidos` de `registrar_comando` e rode o arquivo de novo.
- **Gemini** (`GEMINI_API_KEY`) para o `pergunta`. Depois de qualquer mudança no conteúdo, rode `npm run ask` para atualizar `api/_askPerfil.js`.
- Opcionais: `GITHUB_SITE_TOKEN` (stats mais completos) e reCAPTCHA no contato.

### CTF (comando `ctf`)

A flag fica dividida em 3 pedaços codificados: um comentário em Base64 no `index.html`, uma
mensagem em hex no console (`src/main.jsx`) e o cabeçalho `X-Ctf-Hint` (ROT13) que o
`vercel.json` manda junto com o `public/robots.txt`. O site não conhece a flag: o banco guarda
só o SHA-256 dela em `ctf_config`, e a função `ctf_enviar` confere o envio, com no máximo 30
tentativas por minuto, 2000 por dia e 50 nomes novos por dia no placar.

Nunca escreva a flag em texto puro no repositório (commits, issues, PRs ou comentários). Para
trocar a flag:

1. Escolha a flag nova no formato `bicalho{...}` e divida em 3 pedaços.
2. Codifique cada pedaço (o próprio `cifra` faz isso) e troque nos três lugares acima.
3. No SQL Editor do Supabase (e não num arquivo do repositório), rode:
   `update public.ctf_config set flag_sha256 = encode(extensions.digest('<flag nova>', 'sha256'), 'hex') where id = 1;`
4. Opcional: zere o placar com `delete from public.ctf_placar;`.

Conteúdo:

- **Spotify**: os cards usam serviços que pedem para você entrar com o Spotify uma vez:
  [spotify-github-profile](https://spotify-github-profile.kittinanx.com/api/login) e
  [spotify-recently-played](https://spotify-recently-played.jeffreyca.workers.dev). Sem login, eles ficam escondidos e aparece só o link do seu perfil. Uma música para o player vai em `TRACK_ID` (`src/config/spotifyConfig.js`).
- **Agora**: `src/data/agoraData.js` (texto em pt e en de cada item e o mês da última atualização).
- **Projetos**: `src/data/projectsData.js` + títulos e descrições em `projetos.*` no i18n.
- **Currículo em inglês** (opcional): salve `public/cv-en.pdf` e marque `en: true` em `CURRICULOS` (`src/components/Curriculo.jsx`).
- **Níveis das habilidades**: ocultos. Para mostrar, ajuste `level` e mude `MOSTRAR_NIVEL` para `true` em `src/data/skillsMeta.js`.
- **PDF**: `public/cv-pt.pdf` é o PDF do seu Lattes sem endereço e telefone. Ao atualizar, nunca publique o PDF original do Lattes, que traz os dois.
- **Endereço do site**: troque `arthur-bicalho.vercel.app` em `index.html` pelo endereço que a Vercel der ao projeto. `public/og.png` é a prévia do link.

## Créditos

Este portfólio foi adaptado do [Portfólio Terminal](https://github.com/joaopauloaramuni/joaopauloaramuni-portfolio)
do Prof. João Paulo Aramuni, sob a licença MIT. O README original tem guias detalhados de
configuração do EmailJS, GitHub API, WakaTime, Supabase (livro de visitas e contador de visitas)
e da IA do comando `pergunta`.

## Licença

MIT. Veja [LICENSE](LICENSE).
