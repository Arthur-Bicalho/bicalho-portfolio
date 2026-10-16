import { parseSkin } from "../terminal/parseSkin";

// Dados do comando "lattes".
//
// Para mostrar o seu Currículo Lattes, preencha `lattesInfo` abaixo:
//   id / url      o número do seu Lattes (http://lattes.cnpq.br/<id>)
//   orcid         opcional
//   atualizadoEm  data da última atualização no Lattes (AAAA-MM-DD)
//   pdf           opcional: salve o PDF em public/lattes.pdf e preencha
//                 { arquivo: "/lattes.pdf", bytes: <tamanho>, paginas: <n> }
// Enquanto `url` estiver vazio, o comando mostra um aviso de "em breve".
// O resumo (texto do card) fica no i18n, em lattes.resumo_texto.

export const lattesInfo = {
  id: "4367583296858529",
  nome: "Arthur Bicalho Angelo",
  url: "http://lattes.cnpq.br/4367583296858529",
  orcid: "",
  atualizadoEm: "2026-08-11",
  // public/cv-pt.pdf: o PDF exportado do Lattes, sem o endereço e o telefone
  // (o original traz os dois: nunca publique ele como está)
  pdf: { arquivo: "/cv-pt.pdf", bytes: 1451504, paginas: 1 },
};

// Seções: "lattes" e "lattes --resumo" abrem o resumo; "lattes --pdf"
// mostra o card de download do PDF
export const SECTIONS = ["resumo", "pdf"];
export const DEFAULT_SECTION = "resumo";

const SECTION_ALIASES = {
  resumo: "resumo",
  summary: "resumo",
  overview: "resumo",
  pdf: "pdf",
  download: "pdf",
  baixar: "pdf",
};

export const parseLattesSection = (args) =>
  parseSkin(args, SECTION_ALIASES, DEFAULT_SECTION);
