import { readFileSync } from 'node:fs'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import GITHUB_STATS_CONFIG from './src/config/gitHubStatsConfig.js'
import { atenderGitHub, PROXY_PATH } from './api/_github.js'
import { atenderAsk, PROXY_PATH as ASK_PATH } from './api/_ask.js'
import { atenderClima, PROXY_PATH as CLIMA_PATH } from './api/_clima.js'

// Comando "stats": os badges de visitas (komarev e views-counter) também não
// liberam CORS. Em produção quem repassa são os rewrites do vercel.json.
const { USERNAME, PROFILE_VIEWS_PATH, REPO_VIEWS_PATH } = GITHUB_STATS_CONFIG
const githubStatsProxy = {
  [PROFILE_VIEWS_PATH]: {
    target: 'https://komarev.com',
    changeOrigin: true,
    rewrite: () => `/ghpvc/?username=${USERNAME}`,
  },
  [REPO_VIEWS_PATH]: {
    target: 'https://views-counter.vercel.app',
    changeOrigin: true,
    // Mantém a query (?pageId=...&type=total)
    rewrite: (path) => path.replace(REPO_VIEWS_PATH, '/badge'),
  },
}

const proxy = { ...githubStatsProxy }

// Comandos "github" e "stats": /api/github?path=... repassa à GitHub API com o
// token do site. Em produção quem faz isso é a Vercel Function api/github.js;
// aqui, no npm run dev e no npm run preview, é este middleware. O token fica
// só no servidor do Vite: sem o prefixo VITE_, ele não entra no build.
function githubSiteToken(token) {
  const middleware = (req, res, next) => {
    if (new URL(req.url, 'http://localhost').pathname !== PROXY_PATH) return next()
    atenderGitHub(req, res, token).catch(next)
  }
  return {
    name: 'github-site-token',
    configureServer: (server) => {
      server.middlewares.use(middleware)
    },
    configurePreviewServer: (server) => {
      server.middlewares.use(middleware)
    },
  }
}

// Comando "ask": POST /api/ask manda a pergunta para a IA (Gemini) com a
// chave do site e devolve a resposta em streaming. Em produção quem faz isso
// é a Vercel Function api/ask.js; aqui, no npm run dev e no npm run preview,
// é este middleware. A chave (GEMINI_API_KEY) fica só no servidor do Vite.
function askIA(env) {
  const middleware = (req, res, next) => {
    if (new URL(req.url, 'http://localhost').pathname !== ASK_PATH) return next()
    atenderAsk(req, res, env).catch(next)
  }
  return {
    name: 'ask-ia',
    configureServer: (server) => {
      server.middlewares.use(middleware)
    },
    configurePreviewServer: (server) => {
      server.middlewares.use(middleware)
    },
  }
}

// Clima da boas-vindas: GET /api/clima. Em produção a Vercel Function
// api/clima.js lê a cidade dos cabeçalhos x-vercel-ip-*; aqui eles não
// existem, então vale o CLIMA_LOCAL_DEV do .env.local (sem ele, a linha do
// clima não aparece no dev).
function clima(env) {
  const middleware = (req, res, next) => {
    if (new URL(req.url, 'http://localhost').pathname !== CLIMA_PATH) return next()
    atenderClima(req, res, env.CLIMA_LOCAL_DEV).catch(next)
  }
  return {
    name: 'clima',
    configureServer: (server) => {
      server.middlewares.use(middleware)
    },
    configurePreviewServer: (server) => {
      server.middlewares.use(middleware)
    },
  }
}

// Cabeçalhos de segurança (CSP, X-Frame-Options...): em produção quem manda é
// a seção "headers" do vercel.json. No npm run preview este plugin aplica os
// mesmos, lidos do próprio vercel.json, para testar o build com a CSP de
// verdade. No npm run dev não: o Vite injeta scripts inline para o HMR.
//
// Os "source" do vercel.json usados aqui são expressões regulares simples
// ("/(.*)", "/((?!quake/).*)"), então cada um vira ^source$.
//
// O script inline do index.html entra na CSP pelo hash. Se ele mudar, gere o
// novo hash e troque nos dois lugares do vercel.json onde aparece 'sha256-…':
//   node -e "const s=require('fs').readFileSync('index.html','utf8');const m=s.match(/<script>([\s\S]*?)<\/script>/);console.log(require('crypto').createHash('sha256').update(m[1]).digest('base64'))"
function cabecalhosDaVercel() {
  const regras = (JSON.parse(readFileSync('./vercel.json', 'utf8')).headers ?? []).map((regra) => ({
    padrao: new RegExp(`^${regra.source}$`),
    headers: regra.headers,
  }))
  return {
    name: 'cabecalhos-da-vercel',
    configurePreviewServer: (server) => {
      server.middlewares.use((req, res, next) => {
        const { pathname } = new URL(req.url, 'http://localhost')
        for (const regra of regras) {
          if (!regra.padrao.test(pathname)) continue
          for (const { key, value } of regra.headers) res.setHeader(key, value)
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Prefixo '' lê todas as variáveis do .env.local, inclusive as sem VITE_
  // (isso não as expõe: o que vai para o navegador continua só VITE_*)
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      githubSiteToken(env.GITHUB_SITE_TOKEN),
      askIA(env),
      clima(env),
      cabecalhosDaVercel(),
    ],
    server: { proxy },
    preview: { proxy },
    // Os dois pedaços grandes (o globo 3D do "skills --globo", com o three.js,
    // e o visualizador de PDF do "curriculo") só descem quando o comando roda:
    // não pesam na abertura do site, então o aviso de 500 kB não se aplica
    build: { chunkSizeWarningLimit: 1000 },
  }
})
