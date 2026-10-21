import registrar from "./registrar";

// Textos do comando "recado" (components/Recado.jsx)
registrar({
  pt: {
    recado: {
      titulo: "Recado anônimo",
      intro: "Escreva o que quiser: só eu leio. Não peço nome, e-mail nem nada que identifique você.",
      campo: "Seu recado",
      contador: "{{n}}/{{max}}",
      teclado: "Enter envia · Esc volta ao terminal",
      enviando: "enviando...",
      enviado: "Recado enviado",
      enviado_detalhe: "Obrigado! Só o Arthur lê.",
      erro_limite: "Muitos recados agora. Tente de novo daqui a um minuto.",
      erro_limite_dia: "O limite de recados de hoje acabou. Tente de novo amanhã.",
      erro_tamanho: "O recado precisa ter de 1 a 280 caracteres.",
      erro: "Não consegui enviar agora. Tente de novo em instantes.",
      nao_configurado: "Os recados ainda não foram configurados neste site.",
      outro: "Escrever outro",
      voltar: "Voltar ao terminal",
    },
  },
  en: {
    recado: {
      titulo: "Anonymous note",
      intro: "Write whatever you want: only I read it. I don't ask for a name, e-mail or anything that identifies you.",
      campo: "Your note",
      contador: "{{n}}/{{max}}",
      teclado: "Enter sends · Esc goes back to the terminal",
      enviando: "sending...",
      enviado: "Note sent",
      enviado_detalhe: "Thanks! Only Arthur reads it.",
      erro_limite: "Too many notes right now. Try again in a minute.",
      erro_limite_dia: "Today's note limit is used up. Try again tomorrow.",
      erro_tamanho: "The note must have 1 to 280 characters.",
      erro: "I couldn't send it right now. Try again in a moment.",
      nao_configurado: "Notes aren't set up on this site yet.",
      outro: "Write another",
      voltar: "Back to terminal",
    },
  },
});
