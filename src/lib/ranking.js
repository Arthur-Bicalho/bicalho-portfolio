import { obterSupabase } from "./supabase";

// Ranking de comandos (supabase/ranking_comandos.sql): cada comando soma 1
// no máximo uma vez por sessão do navegador. Vai só o nome do comando (nunca
// o que foi digitado depois dele), sem IP nem identificação. O banco ignora
// nomes fora da lista dele e limita a frequência; aqui é só para não gastar
// chamadas à toa. Erros não aparecem: o ranking é um extra.

const CHAVE = "portfolio:rankingEnviados";

// Os já enviados nesta sessão (vale também entre recarregamentos da aba)
const enviados = new Set(
  (() => {
    try {
      const salvos = JSON.parse(sessionStorage.getItem(CHAVE));
      return Array.isArray(salvos) ? salvos : [];
    } catch {
      return [];
    }
  })(),
);

function marcarEnviado(nome) {
  enviados.add(nome);
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify([...enviados]));
  } catch {
    // sem storage: vale o Set em memória até recarregar a página
  }
}

export function registrarComando(nome) {
  if (enviados.has(nome)) return;
  marcarEnviado(nome);
  obterSupabase()
    .then((supabase) => supabase?.rpc("registrar_comando", { nome }))
    .catch(() => {});
}
