// https://dashboard.emailjs.com/admin
const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  TEMPLATE_ID_FOR_ME: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_FOR_ME, // template para você
  TEMPLATE_ID_FOR_SENDER: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_FOR_SENDER, // template de confirmação
  // Aviso de mensagem nova no guestbook; sem ele, usa o TEMPLATE_ID_FOR_ME
  TEMPLATE_ID_GUESTBOOK:
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID_GUESTBOOK || import.meta.env.VITE_EMAILJS_TEMPLATE_ID_FOR_ME,
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  // E-mail de confirmação para quem escreveu no "contato". Desligado por
  // padrão: ele vai para qualquer endereço digitado no formulário, então
  // alguém poderia usar o site para mandar e-mails a terceiros pela minha
  // conta. Só liga com VITE_EMAILJS_CONFIRMACAO=true.
  CONFIRMACAO: import.meta.env.VITE_EMAILJS_CONFIRMACAO === "true",
};

export default EMAILJS_CONFIG;
