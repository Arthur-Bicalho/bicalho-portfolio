import registrar from "./registrar";

// Textos do comando "quiz" (components/Quiz.jsx)
registrar({
  pt: {
    quiz: {
      titulo: "Quiz: o quanto você me conhece?",
      progresso: "Pergunta {{n}} de {{total}}",
      opcoes: "Opções",
      teclado: "1–4 ou clique para responder · Enter avança · Esc sai",
      certo: "Certo!",
      errado: "Não: era {{resposta}}.",
      onde: "Está em: {{comando}}",
      proxima: "Próxima",
      resultado: "Fim! Você acertou {{acertos}} de {{total}}.",
      comentario: {
        perfeito: "Você me conhece melhor do que eu. Bora tomar um café?",
        bom: "Mandou bem! Já dá para dizer que somos conhecidos.",
        medio: "Nada mal. Tem coisa que só o sobre conta.",
        baixo: "Vamos nos conhecer melhor? Comece pelo sobre.",
      },
      revisar: "Para conferir as que errou:",
      de_novo: "Jogar de novo",
      voltar: "Voltar ao terminal",
    },
  },
  en: {
    quiz: {
      titulo: "Quiz: how well do you know me?",
      progresso: "Question {{n}} of {{total}}",
      opcoes: "Options",
      teclado: "1–4 or click to answer · Enter goes on · Esc quits",
      certo: "Correct!",
      errado: "No: it was {{resposta}}.",
      onde: "It's in: {{comando}}",
      proxima: "Next",
      resultado: "Done! You got {{acertos}} out of {{total}}.",
      comentario: {
        perfeito: "You know me better than I do. Coffee sometime?",
        bom: "Nice! I'd say we're acquainted.",
        medio: "Not bad. Some things only the about command tells.",
        baixo: "Let's get to know each other? Start with about.",
      },
      revisar: "To check the ones you missed:",
      de_novo: "Play again",
      voltar: "Back to terminal",
    },
  },
});
