import {
  SiGit,
  SiGithub,
} from "react-icons/si";
import { skillsData } from "./skillsData";

// Lista do "skills --globo". Começa pelas skills de skillsData.js (mesmos
// ícones, cores e links para os repositórios) e acrescenta as linguagens e
// ferramentas que só aparecem no globo, sem nível.
//
// color → cor do logo legível no fundo escuro (no tema light o CSS escurece)
// link  → site oficial da tecnologia
//
// Para incluir outra: importe o ícone de react-icons (https://react-icons.github.io)
// e adicione { name, icon, color, link }. O globo se redistribui sozinho.

const extras = [
  // Ferramentas
  { name: "Git", icon: SiGit, color: "#F05032", link: "https://git-scm.com/" },
  { name: "GitHub", icon: SiGithub, color: "#FFFFFF", link: "https://github.com/Arthur-Bicalho" },
];

export const globeSkills = [
  ...skillsData.map(({ name, icon, color, link }) => ({ name, icon, color, link })),
  ...extras,
];
