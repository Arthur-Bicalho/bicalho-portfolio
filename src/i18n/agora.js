import registrar from "./registrar";

// Textos do comando "agora" (components/Agora.jsx). A lista em si fica em
// data/agoraData.js.
registrar({
  pt: {
    agora: {
      titulo: "Agora",
      intro: "O que estou fazendo neste momento.",
      itens: {
        estudando: "estudando",
        construindo: "construindo",
        praticando: "praticando",
        aprendendo: "aprendendo",
      },
      push_titulo: "Último push público",
      carregando: "buscando no GitHub...",
      sem_push: "Nenhum push público nos eventos recentes do GitHub.",
      erro: "Não consegui falar com o GitHub agora.",
      limite: "O GitHub limitou as consultas por agora. Tente de novo em alguns minutos.",
      no_repo: "em",
      commits_one: "{{count}} commit",
      commits_other: "{{count}} commits",
      ver: "ver no GitHub",
      atualizado: "atualizado em {{data}}",
    },
  },
  en: {
    agora: {
      titulo: "Now",
      intro: "What I'm doing at the moment.",
      itens: {
        estudando: "studying",
        construindo: "building",
        praticando: "practicing",
        aprendendo: "learning",
      },
      push_titulo: "Latest public push",
      carregando: "asking GitHub...",
      sem_push: "No public push in my recent GitHub events.",
      erro: "I couldn't reach GitHub right now.",
      limite: "GitHub is rate-limiting requests for now. Try again in a few minutes.",
      no_repo: "to",
      commits_one: "{{count}} commit",
      commits_other: "{{count}} commits",
      ver: "view on GitHub",
      atualizado: "updated {{data}}",
    },
  },
});
