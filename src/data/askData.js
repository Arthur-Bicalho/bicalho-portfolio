// Dados do comando "ask" que não estão em nenhum outro lugar do site.
//
// O "npm run ask" junta numa base só o currículo (public/cv-pt.pdf), o que os
// comandos do portfólio mostram (sobre, projetos, habilidades, lattes...) e o texto abaixo, e grava tudo em
// api/_askPerfil.js. É só isso que a IA sabe sobre mim.
//
// Escreva aqui, em primeira pessoa, o que você quer que a IA saiba e que não
// aparece no site: preferências, disponibilidade, como prefere ser
// procurado, opiniões sobre tecnologia... Depois rode de novo:
//   npm run ask
//
// Não coloque aqui nada que você não diria a qualquer visitante: a IA pode
// repetir qualquer trecho desta base.
export const EXTRAS = `
- Para falar comigo, o melhor caminho é o comando \`contato\` (formulário que
  chega no meu e-mail) ou o e-mail arthurbangelo@gmail.com.
- Meus repositórios ficam no GitHub: github.com/Arthur-Bicalho.
- Uso Linux no dia a dia (Arch Linux e Fedora).
- Este portfólio é um terminal feito em React + Vite.
`;
