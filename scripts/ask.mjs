// Monta a base de conhecimento do comando "pergunta" (alias "ask").
//
// Uso:
//   npm run ask
//
// Junta num texto só (Markdown) tudo o que a IA pode saber sobre mim:
//   • o que os comandos do portfólio mostram, em português: sobre,
//     projetos, habilidades e o lattes (lattesData.js);
//   • o texto do currículo em PDF (public/cv-pt.pdf), se existir;
//   • o que estiver em src/data/askData.js (EXTRAS), para o que não aparece
//     no site.
// O resultado vai para api/_askPerfil.js, que a função /api/ask manda para a
// IA junto com cada pergunta. Rode de novo sempre que atualizar o currículo,
// o i18n ou os dados dos comandos: a IA só sabe o que estiver lá.
//
// Os arquivos de src/ usam imports sem extensão e o i18n.js mexe no
// document, então o script carrega tudo pelo próprio Vite (ssrLoadModule),
// do mesmo jeito que o site enxerga. O PDF é lido com o pdfjs-dist, que já
// vem com o react-pdf do comando "curriculo".
//
// Telefone fica de fora (sai do texto do PDF): para contato, a IA indica os
// comando "contato".

import { existsSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = resolve(ROOT, "api/_askPerfil.js");
const CV_PDF = resolve(ROOT, "public/cv-pt.pdf");

// Comandos que não fazem sentido sugerir numa resposta
const COMANDOS_FORA = new Set(["limpar", "pergunta"]);

/* =====================================================================
   Carregando os módulos do site
   ===================================================================== */

// O i18n.js acerta o <html lang> ao carregar: no Node não há document
globalThis.document ??= { documentElement: {} };

const vite = await createServer({
  root: ROOT,
  configFile: false,
  logLevel: "error",
  appType: "custom",
  server: { middlewareMode: true, hmr: false, ws: false },
  optimizeDeps: { noDiscovery: true, include: [] },
});

const carregar = (caminho) => vite.ssrLoadModule(caminho);

let modulos;
try {
  modulos = {
    i18n: (await carregar("/src/i18n.js")).default,
    sobre: await carregar("/src/data/sobreData.js"),
    projetos: await carregar("/src/data/projectsData.js"),
    habilidades: await carregar("/src/data/skillsData.js"),
    globo: await carregar("/src/data/globeSkills.js"),
    lattes: await carregar("/src/data/lattesData.js"),
    comandos: await carregar("/src/commands.js"),
    ask: await carregar("/src/data/askData.js"),
  };
} finally {
  await vite.close();
}

const t = modulos.i18n.getFixedT("pt");

// Tira as tags dos textos do i18n (<b>, <galo>, <repo>...), mantendo o texto
const limpar = (texto) =>
  String(texto ?? "")
    .replace(/<\/?[a-z][a-z0-9_-]*>/gi, "")
    .replace(/\s+/g, " ")
    .trim();

const tx = (chave, opcoes) => {
  const valor = t(chave, opcoes);
  // Chave que não existe volta como a própria chave: ignora
  return valor === chave ? "" : limpar(valor);
};

const lista = (itens) => itens.filter(Boolean).map((item) => `- ${item}`).join("\n");
const secao = (titulo, corpo) => (corpo?.trim() ? `## ${titulo}\n\n${corpo.trim()}\n` : "");
const periodo = (inicio, fim) => {
  if (fim === null) return `${inicio ? `${inicio} – ` : ""}em andamento`;
  if (!inicio && !fim) return "";
  return !inicio || fim === inicio ? `${inicio ?? fim}` : `${inicio} – ${fim}`;
};

/* =====================================================================
   Seções do portfólio
   ===================================================================== */

function identidade() {
  const { NASCIMENTO } = modulos.sobre;
  const nascimento = `${String(NASCIMENTO.dia).padStart(2, "0")}/${String(NASCIMENTO.mes).padStart(2, "0")}/${NASCIMENTO.ano}`;
  return lista([
    `Nome: ${tx("sobre.nome")}`,
    `Cargo: ${tx("sobre.cargo")}`,
    `Lema: ${tx("sobre.lema_1")} ${tx("sobre.lema_2")}`,
    `Moro em: ${tx("sobre.local")}`,
    `Nascimento: ${nascimento} (signo: ${tx("sobre.signo")})`,
  ]);
}

function hoje() {
  return lista(
    modulos.sobre.hoje.map((item) => {
      const base = `sobre.hoje.${item.id}`;
      const em = tx(`${base}.em`) || tx("sobre.hoje.em");
      return `${tx(`${base}.cargo`)} ${em} ${tx(`${base}.org`)}: ${tx(`${base}.detalhe`)}${item.url ? ` (${item.url})` : ""}`;
    })
  );
}

function formacao() {
  return lista(
    modulos.sobre.formacao.map((item) => {
      const base = `sobre.formacao.${item.id}`;
      const quando = periodo(item.inicio, item.fim);
      const curso = tx(`${base}.curso`);
      return `${quando ? `${quando} · ` : ""}${tx(`${base}.nivel`)}${curso ? ` em ${curso}` : ""}, ${tx(`${base}.org`)}`;
    })
  );
}

function destaques() {
  return lista(
    modulos.sobre.destaques.map((item) => {
      const base = `sobre.destaques.${item.id}`;
      return `${tx(`${base}.cargo`)} ${tx(`${base}.em`)} ${tx(`${base}.org`)}: ${tx(`${base}.detalhe`)}`;
    })
  );
}

function idiomas() {
  const { idiomas: ids, interesses } = modulos.sobre;
  return lista([
    ...ids.map((id) => `${tx(`sobre.idiomas.${id}.nome`)}: ${tx(`sobre.idiomas.${id}.nivel`)}`),
    `Interesses: ${interesses.map((id) => tx(`sobre.interesses.${id}`)).join(", ")}`,
  ]);
}

function projetos() {
  return lista(
    modulos.projetos.projectsData.map(
      (p) =>
        `${tx(`projetos.${p.titleId}`)} (${p.technologies.join(", ")}): ${tx(`projetos.${p.descriptionId}`)} ${p.repoLink}`
    )
  );
}

function habilidades() {
  // Só os nomes: os níveis não aparecem no site
  const comNivel = modulos.habilidades.skillsData.map((s) => s.name);
  const extras = modulos.globo.globeSkills.map((s) => s.name).filter((n) => !comNivel.includes(n));
  return lista([...comNivel, ...extras]);
}

function pessoal() {
  const { hobbies, continentes } = modulos.sobre;
  const lugares = continentes
    .map(
      (c) =>
        `${tx(`sobre.pessoal.continentes.${c.id}`)}: ${c.lugares
          .map((l) => tx(`sobre.pessoal.lugares.${l.id}`))
          .join(", ")}`
    )
    .join("; ");
  return lista([
    `Time: ${tx("sobre.pessoal.time")} (Clube Atlético Mineiro, o Galo; o site tem até um tema do Galo: tema --galo)`,
    `Hobbies: ${hobbies.map((h) => tx(`sobre.pessoal.hobbies.${h.id}`)).join(", ")}`,
    `Música: ${tx("sobre.pessoal.musica")}`,
    `Lugares que já visitei: ${lugares}`,
  ]);
}

function lattes() {
  const { lattesInfo } = modulos.lattes;
  if (!lattesInfo.url) return "";
  return lista([
    `Currículo Lattes: ${lattesInfo.url}${lattesInfo.orcid ? ` (ORCID: ${lattesInfo.orcid})` : ""}`,
  ]);
}

function comandos() {
  return lista(
    Object.values(modulos.comandos.commandList)
      .filter((c) => !COMANDOS_FORA.has(c.name))
      .map((c) => `\`${c.name}\` (ou ${c.aliases.map((a) => `\`${a}\``).join(", ")}): ${tx(`ajuda.${c.name}.desc`)}`)
  );
}

function links() {
  const { GITHUB_URL, EMAIL, LINKEDIN_URL, INSTAGRAM_URL } = modulos.sobre;
  return lista([
    `GitHub: ${GITHUB_URL}`,
    `LinkedIn: ${LINKEDIN_URL}`,
    `Instagram: ${INSTAGRAM_URL}`,
    modulos.lattes.lattesInfo.url && `Lattes: ${modulos.lattes.lattesInfo.url}`,
    `E-mail: ${EMAIL}`,
  ]);
}

/* =====================================================================
   Currículo em PDF
   ===================================================================== */

async function textoDoCurriculo() {
  if (!existsSync(CV_PDF)) return "";
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const pdf = await getDocument({
    url: CV_PDF,
    useSystemFonts: true,
    isEvalSupported: false,
    verbosity: 0,
  }).promise;
  const paginas = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const pagina = await pdf.getPage(n);
    const { items } = await pagina.getTextContent();
    paginas.push(items.map((item) => item.str + (item.hasEOL ? "\n" : "")).join(""));
  }
  await pdf.destroy();

  // O cabeçalho (e-mail, GitHub, LinkedIn com ícones) já está em "Links":
  // o texto começa no "Objetivo"
  const texto = paginas.join("\n");
  const inicio = texto.search(/^Objetivo\s*$/m);

  return (
    (inicio > 0 ? texto.slice(inicio) : texto)
      // Ícones da fonte (e-mail, GitHub, LinkedIn...) viram caracteres soltos
      .replace(/[\u{E000}-\u{F8FF}]/gu, "")
      // Telefone: fica de fora da base
      .replace(/(?<![\d/])\+?\(?\d{2}\)?[\s.-]?9?\d{4}[\s.-]?\d{4}(?!\d)/g, "")
      // Palavras hifenizadas na quebra de linha: "exper-\niência" → "experiência"
      .replace(/(\p{L})-\n(\p{Ll})/gu, "$1$2")
      .replace(/[ \t]+/g, " ")
      .replace(/ *\n */g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

/* =====================================================================
   Gravando
   ===================================================================== */

const curriculo = await textoDoCurriculo();
const hojeIso = new Date().toISOString().slice(0, 10);

const perfil = [
  `# Base de conhecimento sobre ${tx("sobre.nome")}\n\nGerada por npm run ask em ${hojeIso}. A parte "Portfólio" é a mais atualizada; o "Currículo em PDF" (se houver) traz mais detalhes. Se os dois discordarem, vale o portfólio.`,
  "# Portfólio",
  secao("Identidade", identidade()),
  secao("Quem sou", tx("sobre.bio_1")),
  secao("O que faço hoje", hoje()),
  secao("Formação", formacao()),
  secao("Destaques", destaques()),
  secao("Idiomas e interesses", idiomas()),
  secao("Projetos (comando projetos)", projetos()),
  secao("Linguagens e ferramentas que uso (comando skills)", habilidades()),
  secao("Fora do terminal", pessoal()),
  secao("Lattes (comando lattes)", lattes()),
  secao("Outras informações", modulos.ask.EXTRAS),
  secao("Links", links()),
  secao("Comandos deste portfólio (para indicar ao visitante)", comandos()),
  curriculo && "# Currículo em PDF (public/cv-pt.pdf, comando curriculo)",
  curriculo,
]
  .filter(Boolean)
  .join("\n\n");

// Template string legível no arquivo: só escapa o que quebraria o literal
const literal = perfil.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

const { NASCIMENTO } = modulos.sobre;
const conteudo = `// Gerado por scripts/ask.mjs (npm run ask). Não edite à mão: para mudar o
// que a IA do comando "pergunta" sabe, edite o currículo (public/cv-pt.pdf), os
// dados dos comandos ou o src/data/askData.js e rode de novo.
//
// Base de conhecimento que a função /api/ask manda para a IA junto com cada
// pergunta. Tudo aqui é público: está no site ou no currículo em PDF.

// Para o servidor calcular a idade no dia da pergunta
export const PERFIL_FATOS = ${JSON.stringify({ geradoEm: hojeIso, nascimento: NASCIMENTO }, null, 2)};

export const PERFIL = \`${literal}\n\`;
`;

writeFileSync(OUTPUT, conteudo);

const kb = (Buffer.byteLength(perfil) / 1024).toFixed(1);
// ~4 caracteres por token em português: é só uma ordem de grandeza
const tokens = Math.round(perfil.length / 4 / 1000);
console.log(`✔ api/_askPerfil.js: ${kb} kB, ~${tokens} mil tokens por pergunta`);
