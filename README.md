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

Links diretos: `?cmd=sobre` abre o site já rodando um comando e `?lang=en` abre em inglês.

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

## O que ainda falta configurar

Contas e chaves (vão nas variáveis de ambiente da Vercel; veja o `.env.example`):

- **EmailJS** para o formulário do `contato`.
- **Supabase** para o `guestbook` e o contador de visitas (rode os dois arquivos de `supabase/` no SQL Editor).
- **Gemini** (`GEMINI_API_KEY`) para o `pergunta`. Depois de qualquer mudança no conteúdo, rode `npm run ask` para atualizar `api/_askPerfil.js`.
- Opcionais: `GITHUB_SITE_TOKEN` (stats mais completos) e reCAPTCHA no contato.

Conteúdo:

- **Spotify**: os cards usam serviços que pedem para você entrar com o Spotify uma vez:
  [spotify-github-profile](https://spotify-github-profile.kittinanx.com/api/login) e
  [spotify-recently-played](https://spotify-recently-played.jeffreyca.workers.dev). Sem login, eles ficam escondidos e aparece só o link do seu perfil. Uma música para o player vai em `TRACK_ID` (`src/config/spotifyConfig.js`).
- **Projetos**: `src/data/projectsData.js` + títulos e descrições em `projetos.*` no i18n.
- **Currículo em inglês** (opcional): salve `public/cv-en.pdf` e marque `en: true` em `CURRICULOS` (`src/components/Curriculo.jsx`).
- **Níveis das habilidades**: ocultos. Para mostrar, ajuste `level` e mude `MOSTRAR_NIVEL` para `true` em `src/data/skillsData.js`.
- **PDF**: `public/cv-pt.pdf` é o PDF do seu Lattes sem endereço e telefone. Ao atualizar, nunca publique o PDF original do Lattes, que traz os dois.
- **Endereço do site**: troque `arthur-bicalho.vercel.app` em `index.html` pelo endereço que a Vercel der ao projeto. `public/og.png` é a prévia do link.

## Créditos

Este portfólio foi adaptado do [Portfólio Terminal](https://github.com/joaopauloaramuni/joaopauloaramuni-portfolio)
do Prof. João Paulo Aramuni, sob a licença MIT. O README original tem guias detalhados de
configuração do EmailJS, GitHub API, WakaTime, Supabase (livro de visitas e contador de visitas)
e da IA do comando `pergunta`.

## Licença

MIT. Veja [LICENSE](LICENSE).
