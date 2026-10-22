import registrar from "./registrar";

// Textos do comando "traduzir" (components/Traduzir.jsx)
registrar({
  pt: {
    traduzir: {
      titulo: "Tradução",
      traduzindo: "traduzindo...",
      idiomas: {
        pt: "Português",
        en: "Inglês",
        de: "Alemão",
        es: "Espanhol",
      },
      lista: "Traduções",
      nota: "Traduzido por IA (Gemini): pode errar.",
      erro_longo: "Texto longo demais: até {{max}} caracteres.",
      erro_limite: "Muitos pedidos agora. Tente de novo em {{segundos}} s.",
      erro_limite_ia: "A IA está sem fôlego agora. Tente de novo em um minuto.",
      erro_config: "A tradução ainda não foi configurada neste site.",
      erro: "Não consegui traduzir agora. Tente de novo em instantes.",
    },
  },
  en: {
    traduzir: {
      titulo: "Translation",
      traduzindo: "translating...",
      idiomas: {
        pt: "Portuguese",
        en: "English",
        de: "German",
        es: "Spanish",
      },
      lista: "Translations",
      nota: "Translated by AI (Gemini): it can make mistakes.",
      erro_longo: "Text too long: up to {{max}} characters.",
      erro_limite: "Too many requests right now. Try again in {{segundos}} s.",
      erro_limite_ia: "The AI is out of breath right now. Try again in a minute.",
      erro_config: "Translation isn't set up on this site yet.",
      erro: "I couldn't translate it right now. Try again in a moment.",
    },
  },
});
