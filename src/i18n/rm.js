import registrar from "./registrar";

// Textos do "rm" e do "sudo" (components/RmRf.jsx)
registrar({
  pt: {
    rm: {
      apagando: "apagando o portfólio...",
      removido: "removido '{{arquivo}}'",
      brincadeira: "Brincadeira! Nada foi apagado: este terminal é só de mentira.",
      backup: "Mas no seu computador de verdade, faça backup. 😉",
      negado: "rm: não é possível remover '{{alvo}}': Permissão negada (o visitante só tem leitura)",
      operando: "rm: falta um operando. Tente 'rm -rf /', se tiver coragem.",
      sudoers: "visitante não está no arquivo sudoers. Este incidente será reportado.",
    },
  },
  en: {
    rm: {
      apagando: "deleting the portfolio...",
      removido: "removed '{{arquivo}}'",
      brincadeira: "Just kidding! Nothing was deleted: this terminal is make-believe.",
      backup: "But on your real computer, back things up. 😉",
      negado: "rm: cannot remove '{{alvo}}': Permission denied (visitors are read-only)",
      operando: "rm: missing operand. Try 'rm -rf /', if you dare.",
      sudoers: "visitante is not in the sudoers file. This incident will be reported.",
    },
  },
});
