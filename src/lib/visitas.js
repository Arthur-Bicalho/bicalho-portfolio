import { obterSupabase, supabaseConfigurado } from "./supabase";

// Contador de visitas da tela de boas-vindas (SQL em supabase/contador_visitas.sql).
//
// Uma visita é uma sessão que termina depois de 30 minutos sem atividade,
// como no Google Analytics: quem entra de manhã, de tarde e de noite conta 3;
// F5, o `clear` e várias abas abertas juntas não contam de novo.
//
// A "atividade" é guardada no localStorage: o carregamento da página e cada
// comando digitado (marcarAtividade, chamado no App) renovam a janela.

const JANELA_MS = 30 * 60 * 1000;
const CHAVE = "portfolio:ultimaAtividade";

function lerUltimaAtividade() {
  try {
    return Number(localStorage.getItem(CHAVE)) || 0;
  } catch {
    return 0; // aba anônima ou storage bloqueado: conta como visita nova
  }
}

export function marcarAtividade() {
  try {
    localStorage.setItem(CHAVE, String(Date.now()));
  } catch {
    // sem storage, cada carregamento conta como visita
  }
}

// Uma promessa só por carregamento da página: o StrictMode (que roda o efeito
// duas vezes no dev) e o `clear` (que monta o BoasVindas de novo) reaproveitam
// o mesmo resultado em vez de somar outra visita.
let promessa = null;

export function obterVisitas() {
  if (promessa) return promessa;

  promessa = (async () => {
    if (!supabaseConfigurado) return null;

    // Antes de qualquer await: o comando do link direto (?cmd=) também marca
    // atividade, e não pode fazer uma visita nova parecer a mesma sessão
    const novaVisita = Date.now() - lerUltimaAtividade() > JANELA_MS;
    marcarAtividade();

    // O cliente desce sob demanda (ver lib/supabase.js): o número aparece um
    // instante depois da boas-vindas, sem travar a tela
    const supabase = await obterSupabase();
    if (!supabase) return null;

    if (novaVisita) {
      const { data, error } = await supabase.rpc("registrar_visita");
      if (error) {
        console.error("Contador de visitas:", error);
        return null;
      }
      return data;
    }

    // Mesma sessão: só mostra o total, sem somar
    const { data, error } = await supabase
      .from("contador_visitas")
      .select("total")
      .eq("id", 1)
      .single();
    if (error) {
      console.error("Contador de visitas:", error);
      return null;
    }
    return data?.total ?? null;
  })();

  return promessa;
}
