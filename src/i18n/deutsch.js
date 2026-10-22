import registrar from "./registrar";

// Textos do comando "deutsch" (components/Deutsch.jsx)
registrar({
  pt: {
    deutsch: {
      titulo: "Wort des Tages · palavra do dia",
      titulo_zufall: "Zufallswort · palavra sorteada",
      pronuncia: "pronúncia",
      significado: "significado",
      exemplo: "exemplo",
      contador: "palavra {{n}} de {{total}}",
      dica_dia: "Amanhã tem outra. Quer uma agora? deutsch --zufall",
      dica_zufall: "De novo: deutsch --zufall · a do dia: deutsch",
    },
  },
  en: {
    deutsch: {
      titulo: "Wort des Tages · word of the day",
      titulo_zufall: "Zufallswort · random word",
      pronuncia: "pronunciation",
      significado: "meaning",
      exemplo: "example",
      contador: "word {{n}} of {{total}}",
      dica_dia: "Another one tomorrow. Want one now? deutsch --zufall",
      dica_zufall: "Again: deutsch --zufall · today's word: deutsch",
    },
  },
});
