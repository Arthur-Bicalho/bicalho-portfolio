// Recados dos comandos para o HUD, sem contexto do React: o comando (num
// chunk carregado sob demanda) dispara um evento na window e o Hud.jsx, que
// já está na tela, escuta. Assim o bundle inicial quase não cresce.
//
//   avisarHud("breach")  → o painel BREACH PROTOCOL mostra "ACCESS GRANTED"

export const EVENTO_HUD = "hud:evento";

export function avisarHud(tipo) {
  window.dispatchEvent(new CustomEvent(EVENTO_HUD, { detail: { tipo } }));
}
