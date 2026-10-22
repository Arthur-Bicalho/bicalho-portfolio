import registrar from "./registrar";

// Textos do comando "digitar" (components/Digitar.jsx)
registrar({
  pt: {
    digitar: {
      titulo: "Teste de digitação",
      intro: "Digite o trecho abaixo o mais rápido que conseguir. O relógio começa na primeira tecla.",
      campo: "Digite o trecho",
      ppm: "PPM",
      ppm_longo: "palavras por minuto",
      precisao: "precisão",
      erros: "erros",
      tempo: "tempo",
      teclado: "Enter recomeça com outro trecho · Esc volta ao terminal",
      fim: "Pronto! {{ppm}} PPM com {{precisao}}% de precisão.",
      recorde: "Novo recorde!",
      placar: "Seus melhores",
      placar_vazio: "Seu placar aparece aqui (fica só neste navegador).",
      outro: "Outro trecho",
      voltar: "Voltar ao terminal",
    },
  },
  en: {
    digitar: {
      titulo: "Typing test",
      intro: "Type the snippet below as fast as you can. The clock starts on the first key.",
      campo: "Type the snippet",
      ppm: "WPM",
      ppm_longo: "words per minute",
      precisao: "accuracy",
      erros: "errors",
      tempo: "time",
      teclado: "Enter restarts with another snippet · Esc goes back to the terminal",
      fim: "Done! {{ppm}} WPM at {{precisao}}% accuracy.",
      recorde: "New record!",
      placar: "Your best",
      placar_vazio: "Your scoreboard shows up here (it stays in this browser only).",
      outro: "Another snippet",
      voltar: "Back to terminal",
    },
  },
});
