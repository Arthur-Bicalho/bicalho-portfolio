import {
  AR,
  BE,
  BR,
  CL,
  DE,
  ES,
  IT,
  NL,
  PT,
  US,
} from "country-flag-icons/react/3x2";

// Dados do comando "sobre".
//
// Aqui ficam só a estrutura, os links, os anos e os logos. Os textos
// (cargos, descrições, nomes traduzidos) ficam no i18n, em sobre.<seção>.<id>.

// Data de nascimento: a idade do cabeçalho é calculada a partir dela
export const NASCIMENTO = { ano: 2006, mes: 9, dia: 9 };

// Foto do cabeçalho (em public/). Com null, aparecem as iniciais.
export const AVATAR = "/avatar.jpg";
export const INICIAIS = "AB";

// Links principais (usados no sobre, na boas-vindas e no contato)
export const GITHUB_URL = "https://github.com/Arthur-Bicalho";
export const EMAIL = "arthurbangelo@gmail.com";
export const LINKEDIN_URL = "https://www.linkedin.com/in/arthur-bicalho-angelo-bbba38188/";
export const INSTAGRAM_URL = "https://www.instagram.com/arthurbangelo/";

// Comandos com nome em português e o alias em inglês (ver commands.js),
// para as dicas "$ comando" aparecerem no idioma da página
export const COMANDO_EN = {
  habilidades: "skills",
  projetos: "projects",
  curriculo: "resume",
  contato: "contact",
};

// O que faço hoje (sobre.hoje.<id>.cargo | org | detalhe)
//   logo   imagem em /public; sem logo, usa o ícone na cor `cor`
export const hoje = [
  {
    id: "puc",
    cor: "--icon-school",
    url: "https://www.pucminas.br/",
  },
  {
    id: "webtech",
    cor: "--icon-work",
    url: "https://webtech.network/",
  },
];

// Formação (sobre.formacao.<id>.nivel | curso | org), da mais recente para a
// mais antiga. inicio/fim são opcionais; fim: null → "em andamento".
//   logo   imagem em /public; sem logo, usa o ícone na cor `cor`
export const formacao = [
  {
    id: "graduacao",
    inicio: 2026,
    fim: null,
    cor: "--icon-school",
    url: "https://www.pucminas.br/",
  },
  {
    id: "intercambio",
    cor: "--highlight",
  },
  {
    id: "escola",
    inicio: 2012,
    fim: 2025,
    cor: "--info",
  },
];

// Destaques do Lattes (sobre.destaques.<id>.cargo | em | org | detalhe)
export const destaques = [
  { id: "onu", cor: "--info" },
  { id: "teatro", cor: "--icon-book" },
  { id: "codeforces", cor: "--warn" },
];

// Idiomas, do mais ao menos fluente (sobre.idiomas.<id>.nome | nivel)
export const idiomas = ["portugues", "ingles", "alemao", "espanhol"];

// Áreas de interesse (sobre.interesses.<id>)
export const interesses = ["ciberseguranca", "dados", "software"];

/* ---------- Fora do terminal ---------- */

export const GALO_URL = "https://www.arenamrv.com.br/";

// Hobbies (sobre.pessoal.hobbies.<id>); o ícone é escolhido no SobreMim.jsx
export const hobbies = [{ id: "guitarra" }, { id: "projetos" }, { id: "musica" }];

// Lugares que já visitei, por continente, na ordem em que aparecem.
//   id        chave do nome (sobre.pessoal.lugares.<id>)
//   sigla     código ISO do país, no title da bandeira (Dubai e Abu Dhabi
//             são dois emirados dos Emirados Árabes Unidos: os dois são AE)
//   Bandeira  componente do country-flag-icons; importe o novo país lá em
//             cima (import nomeado: só as bandeiras usadas entram no bundle)
//   cor       token da cor do continente (barra e legenda)
export const continentes = [
  {
    id: "america_do_sul",
    cor: "--success",
    lugares: [
      { id: "brasil", sigla: "BR", Bandeira: BR },
      { id: "argentina", sigla: "AR", Bandeira: AR },
      { id: "chile", sigla: "CL", Bandeira: CL },
    ],
  },
  {
    id: "america_do_norte",
    cor: "--warn",
    lugares: [{ id: "estados_unidos", sigla: "US", Bandeira: US }],
  },
  {
    id: "europa",
    cor: "--info",
    lugares: [
      { id: "alemanha", sigla: "DE", Bandeira: DE },
      { id: "portugal", sigla: "PT", Bandeira: PT },
      { id: "espanha", sigla: "ES", Bandeira: ES },
      { id: "italia", sigla: "IT", Bandeira: IT },
      { id: "holanda", sigla: "NL", Bandeira: NL },
      { id: "belgica", sigla: "BE", Bandeira: BE },
    ],
  },
];

// Links do rodapé "veja também"
export const vejaTambem = ["habilidades", "projetos", "lattes", "curriculo", "contato"];
