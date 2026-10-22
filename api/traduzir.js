// Vercel Function: POST /api/traduzir
// Recebe o texto do comando "traduzir" e devolve as traduções (pt, en, de,
// es) em JSON, com a chave GEMINI_API_KEY, que fica só no servidor. Regras e
// limites em api/_traduzir.js.

import { atenderTraduzir } from "./_traduzir.js";

export default function handler(req, res) {
  return atenderTraduzir(req, res, process.env);
}
