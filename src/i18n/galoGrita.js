import registrar from "./registrar";

// Textos do "galo grita" (components/GaloGrita.jsx)
registrar({
  pt: {
    galogrita: {
      titulo: "Galo grita!",
      tocando: "Tocando a fanfarra do Galo (chiptune original, ~10 s)",
      terminou: "Fim da fanfarra. Vamo, Galo!",
      parado: "Fanfarra interrompida.",
      bloqueado: "O navegador só deixa tocar som depois de um clique.",
      tocar: "Tocar",
      parar: "Parar",
      de_novo: "Tocar de novo",
      sem_audio: "Este navegador não tem Web Audio.",
      escudo_alt: "Escudo do Atlético Mineiro",
      progresso: "Progresso da fanfarra",
    },
  },
  en: {
    galogrita: {
      titulo: "Galo roars!",
      tocando: "Playing the Galo fanfare (original chiptune, ~10 s)",
      terminou: "End of the fanfare. Vamo, Galo!",
      parado: "Fanfare stopped.",
      bloqueado: "The browser only allows sound after a click.",
      tocar: "Play",
      parar: "Stop",
      de_novo: "Play again",
      sem_audio: "This browser doesn't support Web Audio.",
      escudo_alt: "Atlético Mineiro crest",
      progresso: "Fanfare progress",
    },
  },
});
