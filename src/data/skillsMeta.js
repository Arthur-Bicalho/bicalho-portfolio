// Dados das habilidades SEM os ícones: nome, nível, cores e link.
// Fica separado do skillsData.js para o HUD (src/hud) listar os nomes sem
// puxar os ícones do react-icons para o carregamento inicial do site (eles
// só descem quando o comando "skills" roda). Para incluir uma habilidade,
// acrescente aqui e o ícone dela em ICONES no skillsData.js.
//
// level    → 0 a 100 (80+ = Avançado, 50–79 = Intermediário, abaixo = Básico).
//            Só aparece com MOSTRAR_NIVEL = true; hoje os níveis ficam ocultos.
// color    → cor do logo (versão da marca legível no fundo escuro;
//            no tema light o CSS escurece automaticamente)
// gradient → [início, fim] do anel de progresso, tirado das cores da marca
// link     → seus repositórios no GitHub filtrados pela linguagem (ou o
//            site oficial, para sistemas operacionais)

// Mostrar a porcentagem e o nível de cada habilidade (barras, anéis e selos)
export const MOSTRAR_NIVEL = false;

const GITHUB_REPOS = "https://github.com/Arthur-Bicalho?tab=repositories&language=";

export const skillsMeta = [
  {
    name: "C",
    level: 50,
    color: "#659AD2",
    gradient: ["#283593", "#659AD2"],
    link: `${GITHUB_REPOS}c`,
  },
  {
    name: "C++",
    level: 50,
    color: "#659AD2",
    gradient: ["#00599C", "#659AD2"],
    link: `${GITHUB_REPOS}c%2B%2B`,
  },
  {
    name: "Python",
    level: 50,
    color: "#4B8BBE",
    gradient: ["#3776AB", "#FFD43B"],
    link: `${GITHUB_REPOS}python`,
  },
  {
    name: "Java",
    level: 50,
    color: "#F89820",
    gradient: ["#5382A1", "#F89820"],
    link: `${GITHUB_REPOS}java`,
  },
  {
    name: "JavaScript",
    level: 50,
    color: "#F7DF1E",
    gradient: ["#F0DB4F", "#F7DF1E"],
    link: `${GITHUB_REPOS}javascript`,
  },
  {
    name: "React",
    level: 50,
    color: "#61DAFB",
    gradient: ["#087EA4", "#61DAFB"],
    link: `${GITHUB_REPOS}javascript`,
  },
  {
    name: "Node.js",
    level: 50,
    color: "#68A063",
    gradient: ["#3C873A", "#8CC84B"],
    link: `${GITHUB_REPOS}javascript`,
  },
  {
    name: "Rust",
    level: 50,
    color: "#DEA584",
    gradient: ["#A72145", "#DEA584"],
    link: `${GITHUB_REPOS}rust`,
  },
  {
    name: "HTML",
    level: 50,
    color: "#E34F26",
    gradient: ["#E34F26", "#F06529"],
    link: `${GITHUB_REPOS}html`,
  },
  {
    name: "CSS",
    level: 50,
    color: "#3C99DC",
    gradient: ["#264DE4", "#3C99DC"],
    link: `${GITHUB_REPOS}css`,
  },
  {
    name: "Linux",
    level: 50,
    color: "#FCC624",
    gradient: ["#333333", "#FCC624"],
    link: "https://www.kernel.org/",
  },
  {
    name: "Arch Linux",
    level: 50,
    color: "#1793D1",
    gradient: ["#0F6A9A", "#1793D1"],
    link: "https://archlinux.org/",
  },
  {
    name: "Fedora",
    level: 50,
    color: "#51A2DA",
    gradient: ["#294172", "#51A2DA"],
    link: "https://fedoraproject.org/",
  },
];
