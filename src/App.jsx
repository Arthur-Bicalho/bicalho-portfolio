import React, { useState, useCallback, useEffect, useRef } from "react";
import Terminal, { ColorMode, TerminalInput, TerminalOutput } from "react-terminal-ui";
import { useSearchParams } from "react-router-dom";
import "./App.css";
import { commandList } from "./commands";
import useTerminalKeys from "./terminal/useTerminalKeys";
import { keepLastCommandAtTop, scrollTerminalToBottom } from "./terminal/terminalDom";
import lazyCommand from "./terminal/lazyCommand";
import Ajuda from "./components/Ajuda";
import BoasVindas from "./components/BoasVindas";
import { marcarAtividade } from "./lib/visitas";
import { registrarComando } from "./lib/ranking";
import Hud from "./hud/Hud";
import BootSequence from "./components/BootSequence";
import GaloFundo from "./components/GaloFundo";
import { useTranslation } from "react-i18next";
import { useTheme, nextTheme } from "./theme/themeContext";
import { parseSkillSkin } from "./data/skillSkins";
import { parseGitHubStatsSection } from "./data/gitHubStatsSections";
import { parseLattesSection } from "./data/lattesData";
import { parseBasquete } from "./config/nbaConfig";

// Os comandos são carregados sob demanda (ver terminal/lazyCommand.jsx): o
// bundle inicial leva só o terminal, a tela de boas-vindas e a ajuda. Antes
// ele tinha 1,66 MB, um terço só do visualizador de PDF do currículo.
const SobreMim = lazyCommand(() => import("./components/SobreMim"));
const Projetos = lazyCommand(() => import("./components/Projetos"));
const ProjetosGitHub = lazyCommand(() => import("./components/ProjetosGitHub"));
const Habilidades = lazyCommand(() => import("./components/Habilidades"));
const Spotify = lazyCommand(() => import("./components/Spotify"));
const GitHubStats = lazyCommand(() => import("./components/GitHubStats"));
const Contato = lazyCommand(() => import("./components/Contato"));
const FlappyPlaneGame = lazyCommand(() => import("./components/FlappyPlaneGame"));
// "jogo" / "quake": o componente é leve (um iframe); o motor e os dados só
// descem quando o comando roda (ver public/quake)
const QuakeGame = lazyCommand(() => import("./components/QuakeGame"));
const LivroVisitas = lazyCommand(() => import("./components/LivroVisitas"));
const Neofetch = lazyCommand(() => import("./components/Neofetch"));
const Jogos = lazyCommand(() => import("./components/Jogos"));
const Basquete = lazyCommand(() => import("./components/Basquete"));
const DesignSystem = lazyCommand(() => import("./components/DesignSystem"));
// O "pergunta" (ask) chama a IA no servidor (api/ask.js): aqui é só o desenho
const Ask = lazyCommand(() => import("./components/Ask"));
// O currículo traz o react-pdf e o PDF.js (~400 kB)
const Curriculo = lazyCommand(() => import("./components/Curriculo"));
// O "lattes" mostra o link e o PDF do Currículo Lattes
const Lattes = lazyCommand(() => import("./components/Lattes"), {
  fallbackKey: "lattes.carregando",
});
// Segurança: minigame breach protocol, CTF, cifras e o que o site sabe de você
const Hack = lazyCommand(() => import("./components/Hack"));
const Ctf = lazyCommand(() => import("./components/Ctf"));
const Cifra = lazyCommand(() => import("./components/Cifra"));
const Whoami = lazyCommand(() => import("./components/Whoami"));
// Dados: ranking de comandos, o que estou fazendo agora e o "galo --stats"
const Ranking = lazyCommand(() => import("./components/Ranking"));
const Agora = lazyCommand(() => import("./components/Agora"));
const GaloStats = lazyCommand(() => import("./components/GaloStats"));
// Comunidade: recado anônimo e indicações de música (com aprovação)
const Recado = lazyCommand(() => import("./components/Recado"));
const Indicar = lazyCommand(() => import("./components/Indicar"));
// Idiomas e viagens: mapa, tradução, palavra alemã do dia e o quiz
const Mapa = lazyCommand(() => import("./components/Mapa"));
const Traduzir = lazyCommand(() => import("./components/Traduzir"));
const Deutsch = lazyCommand(() => import("./components/Deutsch"));
const Quiz = lazyCommand(() => import("./components/Quiz"));
// Diversão e utilidades: digitação, fanfarra do Galo, rm -rf / e compartilhar
const Digitar = lazyCommand(() => import("./components/Digitar"));
const GaloGrita = lazyCommand(() => import("./components/GaloGrita"));
const RmRf = lazyCommand(() => import("./components/RmRf"));
const Compartilhar = lazyCommand(() => import("./components/Compartilhar"));

// Depois do boot, com o navegador ocioso, já baixa os comandos leves: o
// primeiro uso de cada um abre na hora, sem "Carregando...". Ficam de fora os
// pesados e menos usados (currículo e lattes) e a economia de
// dados do celular (Save-Data).
const PRELOAD = [
  SobreMim,
  Projetos,
  ProjetosGitHub,
  Habilidades,
  Spotify,
  GitHubStats,
  Contato,
  FlappyPlaneGame,
  QuakeGame,
  LivroVisitas,
  Neofetch,
  Jogos,
  Basquete,
  DesignSystem,
  Ask,
  Hack,
  Ctf,
  Cifra,
  Whoami,
  Ranking,
  Agora,
  GaloStats,
  Recado,
  Indicar,
  Mapa,
  Traduzir,
  Deutsch,
  Quiz,
  Digitar,
  GaloGrita,
  RmRf,
  Compartilhar,
];

const whenIdle = (fn) =>
  "requestIdleCallback" in window
    ? window.requestIdleCallback(fn, { timeout: 5000 })
    : setTimeout(fn, 2000);

const myPrompt = "visitante@portfolio:~$";

// Linha do comando já digitado: cada palavra num <span> que não quebra, então
// no celular a linha quebra só entre palavras ("tema --galo" nunca vira
// "tema -" / "-galo"). Ver .terminal-palavra no App.css.
const CommandLine = ({ text }) =>
  [myPrompt, ...text.trim().split(/\s+/).filter(Boolean)].map((word, i) => (
    <React.Fragment key={i}>
      {i > 0 && " "}
      <span className="terminal-palavra">{word}</span>
    </React.Fragment>
  ));
// Vira a faixa amarela de título do terminal (ver hud/Hud.css)
const terminalTitle = "Terminal // visitante@portfolio";

// Botões de comandos recentes na taskbar do HUD
const MAX_RECENTES = 3;

// Link direto: seu-site.vercel.app/?cmd=curriculo abre o portfólio já rodando o comando
const DEEP_LINK_MAX_LENGTH = 60;
const readDeepLinkCommand = (searchParams) => {
  const command = (searchParams.get("cmd") ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, DEEP_LINK_MAX_LENGTH);
  return command || null;
};

function App() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const getWelcomeMessage = () => <BoasVindas key="welcome" />;

  const [terminalLineData, setTerminalLineData] = useState([getWelcomeMessage()]);

  // Controla a tela de boot (some quando termina ou o visitante pula)
  const [booted, setBooted] = useState(false);

  // Comando vindo do link (?cmd=...), lido uma vez ao abrir a página
  const [searchParams] = useSearchParams();
  const [deepLinkCommand] = useState(() => readDeepLinkCommand(searchParams));
  const deepLinkDone = useRef(false);

  // Chave única para cada linha adicionada ao terminal
  const lineId = useRef(0);
  const nextKey = (prefix) => `${prefix}-${lineId.current++}`;

  const appendLines = (...lines) => {
    setTerminalLineData((current) => [...current, ...lines]);
  };

  const exitComponent = () => {
    setTerminalLineData((lines) => {
      const newLines = lines.slice(0, -1);
      requestAnimationFrame(() => {
        const input = document.querySelector(".terminal-hidden-input");
        if (input) input.focus();
      });
      return newLines;
    });
  };

  const focusTerminalInput = () => {
    requestAnimationFrame(() => {
      const input = document.querySelector(".terminal-hidden-input");
      if (input) input.focus();
    });
  };

  // Sempre aponta para o handleInput mais recente (usado pelo link direto)
  const runCommandRef = useRef(null);
  useEffect(() => {
    runCommandRef.current = handleInput;
  });

  // Chamado pelo BootSequence ao terminar: libera o terminal e foca o input
  const handleBootFinish = useCallback(() => {
    setBooted(true);
    focusTerminalInput();
  }, []);

  // Terminal liberado: baixa os comandos leves em segundo plano (ver PRELOAD)
  useEffect(() => {
    if (!booted || navigator.connection?.saveData) return;
    whenIdle(() => PRELOAD.forEach((command) => command.preload()));
  }, [booted]);

  // Com o terminal liberado, executa o comando do link direto (?cmd=...).
  // Fica aqui, e não no handleBootFinish, porque quando o boot já rodou nesta
  // aba (F5, outro link) o BootSequence chama onFinish no efeito de montagem
  // dele, que roda antes dos efeitos do App: o runCommandRef ainda estaria vazio.
  useEffect(() => {
    if (!booted || !deepLinkCommand || deepLinkDone.current) return;
    deepLinkDone.current = true;
    // O handleInput já leva o comando para o topo, como em todo comando
    runCommandRef.current?.(deepLinkCommand);
  }, [booted, deepLinkCommand]);

  // Detecta se um jogo (Flappy Plane ou Quake) está aberto
  const lastLineType = terminalLineData[terminalLineData.length - 1]?.type;
  const isGameOpen = lastLineType === FlappyPlaneGame || lastLineType === QuakeGame;

  // Detecta se o contato está aberto
  const isContatoOpen =
    terminalLineData.length > 0 && terminalLineData[terminalLineData.length - 1]?.type === Contato;

  // Detecta se o GuestBook está no modo ADD
  const lastLine = terminalLineData[terminalLineData.length - 1];
  const isGuestBookAddOpen = lastLine?.type === LivroVisitas && lastLine?.props?.mode === "add";

  // hack, cifra, recado e os envios do ctf e do indicar também têm campos ou
  // teclas próprios
  const isInterativoOpen =
    lastLine?.type === Hack ||
    lastLine?.type === Cifra ||
    lastLine?.type === Recado ||
    lastLine?.type === Quiz ||
    lastLine?.type === Digitar ||
    (lastLine?.type === Ctf && lastLine?.props?.modo === "enviar") ||
    (lastLine?.type === Indicar && lastLine?.props?.modo === "enviar");

  // Jogo, contato, guestbook (add) e os acima usam o teclado: o terminal fica em pausa
  const isTerminalPaused = isGameOpen || isContatoOpen || isGuestBookAddOpen || isInterativoOpen;

  // Últimos comandos, para os botões da taskbar (o mais recente primeiro)
  const [recentes, setRecentes] = useState([]);
  const lembrarComando = (command, input) => {
    if (command.name === "limpar") return;
    // "pergunta quem é você?" vira só "pergunta" (e "ctf <flag>" e
    // "recado <texto>", só o nome, para a flag e o recado não ficarem num
    // botão); os outros guardam a opção
    const palavras = input.trim().split(/\s+/);
    const soONome = ["pergunta", "ctf", "recado", "traduzir"].includes(command.name);
    const resumo = soONome ? palavras[0] : palavras.slice(0, 2).join(" ");
    setRecentes((atual) =>
      [resumo, ...atual.filter((item) => item !== resumo)].slice(0, MAX_RECENTES),
    );
  };

  // Atalhos do HUD (gigs, taskbar): rodam o comando no terminal, como se o
  // visitante tivesse digitado. Com jogo/contato abertos, o terminal está em
  // pausa e os atalhos também.
  const runFromHud = (comando) => {
    if (!booted || isTerminalPaused) return;
    runCommandRef.current?.(comando);
    focusTerminalInput();
  };

  // Tab duplo sem completar: mostra as opções, como no bash
  const showCompletions = (typed, options) => {
    appendLines(
      <TerminalInput key={nextKey("input")}>
        <CommandLine text={typed} />
      </TerminalInput>,
      <TerminalOutput key={nextKey("options")}>
        <span className="autocomplete-options">
          {options.map((option) => (
            <span key={option}>{option}</span>
          ))}
        </span>
      </TerminalOutput>,
    );
    scrollTerminalToBottom();
  };

  // Histórico com ↑/↓ e autocomplete com Tab
  const { addToHistory } = useTerminalKeys({
    enabled: booted && !isTerminalPaused,
    commands: commandList,
    onShowOptions: showCompletions,
  });

  function handleInput(input) {
    // Comando digitado é atividade: renova a janela de 30 min do contador de
    // visitas, então quem navega por mais tempo não conta como visita nova
    marcarAtividade();
    addToHistory(input);
    const inputLine = (
      <TerminalInput key={nextKey("input")}>
        <CommandLine text={input} />
      </TerminalInput>
    );

    const args = input.toLowerCase().trim().split(/\s+/);
    const userInput = args[0];
    const subCommand = args[1];
    const command = Object.values(commandList).find(
      (cmd) => cmd.name === userInput || cmd.aliases.includes(userInput),
    );
    const getInvalidCommandOutput = (cmd) => (
      <TerminalOutput>
        {t("comando.nao_reconhecido")} "{cmd}" - {t("comando.ver_ajuda")}
      </TerminalOutput>
    );
    let response;

    if (command) {
      lembrarComando(command, input);
      // Ranking: só o nome do comando, uma vez por sessão (lib/ranking.js)
      if (command.name !== "limpar") registrarComando(command.name);
      switch (command.name) {
        case "sobre":
          response = <SobreMim />;
          break;
        case "ajuda":
          // "ajuda --tudo" | "help --all": a tabela completa, com as categorias
          if (subCommand && !command.subcommands.includes(subCommand)) {
            response = getInvalidCommandOutput(subCommand);
            break;
          }
          response = <Ajuda tudo={Boolean(subCommand)} />;
          break;
        case "pergunta": {
          // "pergunta <texto>" ou "ask <texto>": a IA responde em primeira
          // pessoa (ver components/Ask.jsx). O texto vai como foi digitado,
          // sem o nome do comando (os args acima estão em minúsculas);
          // "--nova" e "--new" esquecem a conversa
          const pergunta = input.trim().replace(/^\S+\s*/, "");
          const nova = ["--nova", "--new"].includes(pergunta.toLowerCase());
          response = <Ask pergunta={nova ? "" : pergunta} nova={nova} />;
          break;
        }
        case "projetos":
          response = <Projetos />;
          break;
        case "github":
          response = <ProjetosGitHub />;
          break;
        case "curriculo":
          response = <Curriculo />;
          break;
        case "lattes": {
          // "lattes" abre o resumo e "--pdf" mostra o card de download
          // (ver data/lattesData.js)
          const section = parseLattesSection(args.slice(1));
          if (!section) {
            response = <TerminalOutput>{t("lattes.uso")}</TerminalOutput>;
            break;
          }
          response = <Lattes section={section} />;
          break;
        }
        case "habilidades": {
          // "skills --lista", "skills --terminal" ou "skills --skin=cards"
          const skin = parseSkillSkin(args.slice(1));
          response = skin ? (
            <Habilidades skin={skin} />
          ) : (
            <TerminalOutput>{t("habilidades.uso")}</TerminalOutput>
          );
          break;
        }
        case "limpar":
          setTerminalLineData([]);
          return;
        case "tema": {
          // "tema" sem opção troca na ordem escuro → claro → galo → escuro...;
          // "tema --claro|--light", "--escuro|--dark" e "--galo" escolhem.
          // Sem os traços ("tema claro") também vale, como era antes.
          const themeArgs = {
            claro: "light",
            light: "light",
            escuro: "dark",
            dark: "dark",
            galo: "galo",
          };
          const option = subCommand?.replace(/^--?/, "");
          if (subCommand && !themeArgs[option]) {
            response = <TerminalOutput>{t("tema.uso")}</TerminalOutput>;
            break;
          }
          const chosen = themeArgs[option] ?? nextTheme(theme);
          setTheme(chosen);
          const messages = {
            light: "tema.claro_ativado",
            dark: "tema.escuro_ativado",
            galo: "tema.galo_ativado",
          };
          response = <TerminalOutput>{t(messages[chosen])}</TerminalOutput>;
          break;
        }
        case "spotify":
          response = <Spotify />;
          break;
        case "stats": {
          // "stats" abre o resumo; "--linguagens", "--atividade", "--horarios",
          // "--repos" e "--tudo" trocam o grupo de gráficos
          // (ver data/gitHubStatsSections.js)
          const section = parseGitHubStatsSection(args.slice(1));
          if (!section) {
            response = <TerminalOutput>{t("stats.uso")}</TerminalOutput>;
            break;
          }
          response = <GitHubStats section={section} />;
          break;
        }
        case "neofetch":
          response = <Neofetch />;
          break;
        case "campeonato": {
          // "campeonato" (ou "galo", "atletico") mostra os próximos jogos do Galo,
          // ao vivo da ESPN; "--todos" | "--all" mostram todos os marcados e
          // "--tabela" | "--table", a classificação do Brasileirão
          if (subCommand && !command.subcommands.includes(subCommand)) {
            response = <TerminalOutput>{t("jogos.uso")}</TerminalOutput>;
            break;
          }
          if (subCommand === "grita" || subCommand === "roar") {
            // Fanfarra chiptune original (components/GaloGrita.jsx)
            response = <GaloGrita />;
            break;
          }
          if (subCommand === "--stats") {
            // Aproveitamento da temporada (components/GaloStats.jsx)
            response = <GaloStats />;
            break;
          }
          const tabela = subCommand === "--tabela" || subCommand === "--table";
          response = <Jogos todos={Boolean(subCommand) && !tabela} tabela={tabela} />;
          break;
        }
        case "basquete": {
          // "basquete" (ou "basketball", "nba") mostra os próximos jogos da
          // NBA, ao vivo da ESPN; a sigla ou o apelido de um time filtram
          // ("nba lal", "nba lakers") e "--todos" | "--all" mostram todos os
          // jogos dos próximos dias (ver config/nbaConfig.js)
          const parsed = parseBasquete(args.slice(1));
          if (!parsed) {
            response = <TerminalOutput>{t("basquete.uso")}</TerminalOutput>;
            break;
          }
          response = <Basquete {...parsed} />;
          break;
        }
        case "design":
          response = <DesignSystem />;
          break;
        case "contato":
          response = <Contato onExit={exitComponent} />;
          break;
        case "jogo": {
          // "jogo", "game" e "quake" abrem o Quake shareware e "flappyplane", o
          // Flappy Plane; "--quake" | "--flappyplane" escolhem o jogo
          if (subCommand && !command.subcommands.includes(subCommand)) {
            response = <TerminalOutput>{t("jogo.uso")}</TerminalOutput>;
            break;
          }
          const flappy = subCommand ? subCommand === "--flappyplane" : userInput === "flappyplane";
          response = !flappy ? (
            <QuakeGame onExit={exitComponent} />
          ) : (
            <FlappyPlaneGame onExit={exitComponent} />
          );
          break;
        }
        case "guestbook": {
          if (!subCommand) {
            // Sem subcomando → mostra home
            response = <LivroVisitas mode="home" onExit={exitComponent} />;
          } else if (command.subcommands.includes(subCommand)) {
            // Subcomando válido
            response = <LivroVisitas mode={subCommand} onExit={exitComponent} />;
          } else {
            // Subcomando inválido → padrão TerminalOutput
            response = getInvalidCommandOutput(subCommand);
          }
          break;
        }
        case "hack": {
          // "hack" (normal: 2 sequências), "--facil" | "--easy" (1) e
          // "--dificil" | "--hard" (3)
          const niveis = { "--facil": "facil", "--easy": "facil", "--dificil": "dificil", "--hard": "dificil" };
          if (subCommand && !niveis[subCommand]) {
            response = <TerminalOutput>{t("hack.uso")}</TerminalOutput>;
            break;
          }
          response = <Hack nivel={niveis[subCommand] ?? "normal"} onExit={exitComponent} />;
          break;
        }
        case "ctf": {
          // "ctf" explica e mostra o placar; "--placar" só o placar; "--enviar"
          // abre o envio, e "ctf <flag>" já abre com a flag (como foi digitada,
          // sem as minúsculas dos args)
          if (!subCommand) {
            response = <Ctf modo="inicio" />;
          } else if (["--placar", "--scoreboard"].includes(subCommand)) {
            response = <Ctf modo="placar" />;
          } else if (["--enviar", "--submit"].includes(subCommand)) {
            response = <Ctf modo="enviar" onExit={exitComponent} />;
          } else if (subCommand.startsWith("-")) {
            response = <TerminalOutput>{t("ctf.uso")}</TerminalOutput>;
          } else {
            const flag = input.trim().replace(/^\S+\s*/, "");
            response = <Ctf modo="enviar" flag={flag} onExit={exitComponent} />;
          }
          break;
        }
        case "cifra": {
          // "cifra <texto>" (como foi digitado); "--decodificar" | "--decode"
          // em qualquer posição troca o sentido
          const palavras = input.trim().split(/\s+/).slice(1);
          const opcao = (p) => ["--decodificar", "--decode"].includes(p.toLowerCase());
          if (palavras.some((p) => p.startsWith("--") && !opcao(p))) {
            response = <TerminalOutput>{t("cifra.uso")}</TerminalOutput>;
            break;
          }
          const texto = palavras.filter((p) => !opcao(p)).join(" ");
          response = (
            <Cifra texto={texto} decodificar={palavras.some(opcao)} onExit={exitComponent} />
          );
          break;
        }
        case "whoami":
          response = <Whoami />;
          break;
        case "ranking":
          response = <Ranking />;
          break;
        case "agora":
          response = <Agora />;
          break;
        case "recado": {
          // "recado <texto>" abre o envio já com o texto, como foi digitado
          const texto = input.trim().replace(/^\S+\s*/, "");
          response = <Recado texto={texto} onExit={exitComponent} />;
          break;
        }
        case "indicar": {
          // "indicar" (ou --lista | --list) mostra as aprovadas;
          // "--enviar" | "--add" abre o envio
          const modos = { "--enviar": "enviar", "--add": "enviar", "--lista": "lista", "--list": "lista" };
          if (subCommand && !modos[subCommand]) {
            response = <TerminalOutput>{t("indicar.uso")}</TerminalOutput>;
            break;
          }
          const modo = modos[subCommand] ?? "lista";
          response = <Indicar modo={modo} onExit={modo === "enviar" ? exitComponent : undefined} />;
          break;
        }
        case "mapa":
          // "mapa <país>" (ex.: "mapa alemanha", "map germany") já abre com o país
          response = <Mapa busca={input.trim().replace(/^\S+\s*/, "")} />;
          break;
        case "traduzir": {
          // "traduzir <texto>": o texto como foi digitado (os args estão em minúsculas)
          const texto = input.trim().replace(/^\S+\s*/, "");
          response = texto ? (
            <Traduzir texto={texto} />
          ) : (
            <TerminalOutput>{t("traduzir.uso")}</TerminalOutput>
          );
          break;
        }
        case "deutsch":
          if (subCommand && !command.subcommands.includes(subCommand)) {
            response = <TerminalOutput>{t("deutsch.uso")}</TerminalOutput>;
            break;
          }
          response = <Deutsch zufall={Boolean(subCommand)} />;
          break;
        case "quiz":
          response = <Quiz onExit={exitComponent} />;
          break;
        case "digitar":
          response = <Digitar onExit={exitComponent} />;
          break;
        case "rm": {
          // "rm -rf /" e "sudo rm -rf /" (também -fr e /*) viram a brincadeira;
          // outro "rm" é negado e outro "sudo" não está no sudoers
          const palavras = input.trim().split(/\s+/);
          const sudo = palavras[0].toLowerCase() === "sudo";
          const resto = sudo ? palavras.slice(1) : palavras;
          const ehRm = resto[0]?.toLowerCase() === "rm";
          const rmrf =
            ehRm &&
            resto.slice(1).some((p) => /^-(rf|fr)$/i.test(p)) &&
            resto.slice(1).some((p) => p === "/" || p === "/*");
          if (rmrf) response = <RmRf modo="rmrf" />;
          else if (sudo && !ehRm) response = <RmRf modo="sudoers" />;
          else if (resto.length <= 1) response = <RmRf modo={sudo ? "sudoers" : "operando"} />;
          else response = <RmRf modo="negado" alvo={resto.at(-1)} />;
          break;
        }
        case "compartilhar": {
          // "compartilhar <comando>": só comandos que existem (o resto do
          // texto vai junto, como no ?cmd=, até 60 caracteres)
          const alvo = input.trim().replace(/^\S+\s*/, "").slice(0, 60);
          const primeira = alvo.split(/\s+/)[0]?.toLowerCase();
          const existe =
            !alvo ||
            Object.values(commandList).some((c) => c.name === primeira || c.aliases.includes(primeira));
          response = existe ? (
            <Compartilhar comando={alvo} />
          ) : (
            <TerminalOutput>{t("compartilhar.uso")}</TerminalOutput>
          );
          break;
        }
        default:
          break;
      }
      // Padrão de todos os comandos: o comando vai para o topo do terminal,
      // com a saída logo abaixo, em vez de o visitante cair no fim dela. Se a
      // saída crescer depois (código lazy, dados, imagens), o próprio
      // componente repete o ajuste (ver terminal/useCommandAtTop.js)
      keepLastCommandAtTop();
    } else {
      response = getInvalidCommandOutput(userInput);
    }

    const outputLines = [response]
      .flat()
      .filter(Boolean)
      .map((line) => React.cloneElement(line, { key: nextKey("output") }));

    appendLines(inputLine, ...outputLines);
  }

  return (
    <>
      {!booted && <BootSequence onFinish={handleBootFinish} />}
      <Hud
        onCommand={runFromHud}
        onFocusTerminal={focusTerminalInput}
        recent={recentes}
        paused={!booted || isTerminalPaused}
        onLanguageChange={focusTerminalInput}
      >
        <div className="terminal-container">
          <GaloFundo />
          <Terminal
            name={terminalTitle}
            colorMode={theme === "light" ? ColorMode.Light : ColorMode.Dark}
            onInput={isTerminalPaused ? undefined : handleInput}
            prompt={myPrompt}
            height="100%"
          >
            {terminalLineData}
          </Terminal>
        </div>
      </Hud>
    </>
  );
}

export default App;
