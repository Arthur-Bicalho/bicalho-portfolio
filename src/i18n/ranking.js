import registrar from "./registrar";

// Textos do comando "ranking" (components/Ranking.jsx)
registrar({
  pt: {
    ranking: {
      titulo: "Ranking de comandos",
      intro: "Os comandos que os visitantes mais rodaram.",
      lista: "Comandos e quantas visitas usaram cada um",
      vezes_one: "{{n}} visita",
      vezes_other: "{{n}} visitas",
      carregando: "contando...",
      vazio: "Ainda não há nada no ranking. Rode alguns comandos e volte aqui!",
      erro: "Não consegui carregar o ranking agora.",
      nao_configurado: "O ranking ainda não foi configurado neste site.",
      nota: "Conta no máximo uma vez cada comando por visita. Só o nome do comando é enviado, sem nada que identifique quem digitou.",
    },
  },
  en: {
    ranking: {
      titulo: "Command ranking",
      intro: "The commands visitors ran the most.",
      lista: "Commands and how many visits used each one",
      vezes_one: "{{n}} visit",
      vezes_other: "{{n}} visits",
      carregando: "counting...",
      vazio: "Nothing in the ranking yet. Run a few commands and come back!",
      erro: "I couldn't load the ranking right now.",
      nao_configurado: "The ranking isn't set up on this site yet.",
      nota: "Each command counts at most once per visit. Only the command name is sent, with nothing that identifies who typed it.",
    },
  },
});
