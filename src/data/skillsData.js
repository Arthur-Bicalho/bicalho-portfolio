import { FaJava } from "react-icons/fa";
import {
  SiC,
  SiCplusplus,
  SiPython,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiRust,
  SiHtml5,
  SiCss3,
  SiLinux,
  SiArchlinux,
  SiFedora,
} from "react-icons/si";

import { MOSTRAR_NIVEL, skillsMeta } from "./skillsMeta";

// Habilidades do comando "skills" (estilos --terminal, --cards e --lista):
// os dados ficam em skillsMeta.js; aqui só entra o ícone de cada uma.
export { MOSTRAR_NIVEL };

const ICONES = {
  "C": SiC,
  "C++": SiCplusplus,
  "Python": SiPython,
  "Java": FaJava,
  "JavaScript": SiJavascript,
  "React": SiReact,
  "Node.js": SiNodedotjs,
  "Rust": SiRust,
  "HTML": SiHtml5,
  "CSS": SiCss3,
  "Linux": SiLinux,
  "Arch Linux": SiArchlinux,
  "Fedora": SiFedora,
};

export const skillsData = skillsMeta.map((skill) => ({ ...skill, icon: ICONES[skill.name] }));
