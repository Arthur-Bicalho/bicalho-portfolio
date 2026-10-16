import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { skillsMeta } from "../data/skillsMeta";
import { AVATAR, GITHUB_URL, NASCIMENTO, continentes } from "../data/sobreData";
import "./Hud.css";

// HUD "netrunner" em volta do terminal: cabeçalho, painel do perfil à
// esquerda, breach protocol e gigs à direita e a taskbar retrô embaixo.
// O terminal (children) continua no meio, igual a antes: o HUD só acrescenta
// atalhos que rodam comandos nele (onCommand), nunca abre abas ou páginas.
// Tudo cabe numa tela: o único rolamento é o do próprio terminal.
// Abaixo de 1180px os painéis laterais somem e o terminal ocupa a largura.

// Sistemas operacionais ganham o quadradinho vermelho em "cyberware"
const SISTEMAS = new Set(["Linux", "Arch Linux", "Fedora"]);

// Atalhos da direita: comando em português e em inglês (os dois funcionam)
const GIGS = [
  { id: "sobre", pt: "sobre", en: "about" },
  { id: "skills", pt: "skills", en: "skills" },
  { id: "curriculo", pt: "curriculo", en: "resume" },
  { id: "pergunta", pt: "pergunta", en: "ask" },
  { id: "contato", pt: "contato", en: "contact" },
  { id: "jogo", pt: "jogo", en: "game" },
  { id: "campeonato", pt: "campeonato", en: "galo" },
];

// Grade decorativa do breach protocol (a coluna do meio acende em sequência)
const BREACH = [
  ["1C", "BD", "55", "E9", "7A"],
  ["55", "E9", "1C", "BD", "FF"],
  ["7A", "1C", "BD", "55", "E9"],
  ["E9", "FF", "7A", "1C", "55"],
  ["BD", "55", "E9", "FF", "1C"],
];

const LUGARES = continentes.reduce((total, c) => total + c.lugares.length, 0);
const HANDLE = `@${GITHUB_URL.split("/").pop()}`;

const idade = () => {
  const hoje = new Date();
  const { ano, mes, dia } = NASCIMENTO;
  const mesAtual = hoje.getMonth() + 1;
  const jaFez = mesAtual > mes || (mesAtual === mes && hoje.getDate() >= dia);
  return hoje.getFullYear() - ano - (jaFez ? 0 : 1);
};

// Código da sessão no cabeçalho: muda a cada visita, só decoração
const SESSAO = `0x${Math.floor(Math.random() * 0xfff)
  .toString(16)
  .toUpperCase()
  .padStart(3, "0")}`;

// Relógio da taskbar: atualiza só ele, sem renderizar o terminal de novo
function Relogio() {
  const { i18n } = useTranslation();
  const [agora, setAgora] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setAgora(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);
  const locale = i18n.language.startsWith("en") ? "en-US" : "pt-BR";
  return (
    <time className="hud-relogio" dateTime={agora.toISOString()}>
      {agora.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
    </time>
  );
}

function Cabecalho() {
  const { t } = useTranslation();
  return (
    <header className="hud-cabecalho">
      <div className="hud-marca">NET//RUNNER</div>
      <div className="hud-cabecalho-info">
        <span className="hud-esconde-celular">
          {t("hud.distrito")} <b>Belo Horizonte</b>
        </span>
        <span className="hud-esconde-celular">
          {t("hud.no")} <b>PUC Minas</b>
        </span>
        <span className="hud-vermelho">● {t("hud.link_ativo")}</span>
        <span className="hud-sessao">
          {t("hud.sessao")} {SESSAO}
        </span>
      </div>
    </header>
  );
}

function Perfil() {
  const { t } = useTranslation();
  return (
    <section className="hud-painel hud-painel-amarelo hud-perfil" aria-labelledby="hud-perfil-titulo">
      <h2 id="hud-perfil-titulo" className="hud-painel-titulo">
        {t("hud.perfil")}
      </h2>
      {AVATAR && (
        <div className="hud-perfil-foto">
          <img src={AVATAR} alt={t("sobre.avatar_alt")} width="272" height="150" />
          <span className="hud-perfil-nome">{t("sobre.nome")}</span>
        </div>
      )}
      <dl className="hud-perfil-dados">
        <dt>{t("hud.handle")}</dt>
        <dd className="hud-ciano">{HANDLE}</dd>
        <dt>{t("hud.classe")}</dt>
        <dd>{t("hud.classe_valor")}</dd>
        <dt>{t("hud.faccao")}</dt>
        <dd>WebTech</dd>
        <dt>{t("hud.origem")}</dt>
        <dd>Belo Horizonte</dd>
        <dt>{t("hud.idade")}</dt>
        <dd>{idade()}</dd>
      </dl>
    </section>
  );
}

function Cyberware() {
  const { t } = useTranslation();
  return (
    <section className="hud-painel hud-painel-ciano hud-cyberware" aria-labelledby="hud-cyberware-titulo">
      <h2 id="hud-cyberware-titulo" className="hud-painel-titulo hud-ciano">
        {t("hud.cyberware")}
      </h2>
      <ul className="hud-cyberware-lista">
        {skillsMeta.map((skill) => (
          <li key={skill.name}>
            <span
              aria-hidden="true"
              className={SISTEMAS.has(skill.name) ? "hud-quadrado hud-quadrado-vermelho" : "hud-quadrado"}
            />
            {skill.name}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Breach() {
  const { t } = useTranslation();
  return (
    <section className="hud-painel hud-painel-vermelho hud-breach" aria-hidden="true">
      <div className="hud-painel-titulo hud-vermelho hud-breach-titulo">
        <span>BREACH PROTOCOL</span>
        <span className="hud-dim">{t("hud.buffer")}</span>
      </div>
      <div className="hud-breach-grade">
        {BREACH.map((linha, i) =>
          linha.map((codigo, j) => (
            <span
              key={`${i}-${j}`}
              className={j === 1 ? "hud-breach-celula hud-breach-ativa" : "hud-breach-celula"}
              style={j === 1 ? { animationDelay: `${i * 0.4}s` } : undefined}
            >
              {codigo}
            </span>
          ))
        )}
      </div>
    </section>
  );
}

function Gigs({ onCommand, paused }) {
  const { t, i18n } = useTranslation();
  const ingles = i18n.language.startsWith("en");
  return (
    <section className="hud-painel hud-painel-amarelo hud-gigs" aria-labelledby="hud-gigs-titulo">
      <h2 id="hud-gigs-titulo" className="hud-painel-titulo">
        {t("hud.gigs")}
      </h2>
      <ul className="hud-gigs-lista">
        {GIGS.map((gig) => {
          const comando = ingles ? gig.en : gig.pt;
          return (
            <li key={gig.id}>
              <button
                type="button"
                className="hud-gig"
                disabled={paused}
                onClick={() => onCommand(comando)}
              >
                <span className="hud-gig-comando">[ {comando} ]</span>
                <span className="hud-gig-desc">{t(`hud.gig.${gig.id}`)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Ticker() {
  const { t } = useTranslation();
  const itens = [
    t("hud.ticker.musica"),
    t("hud.ticker.lugares", { lugares: LUGARES, continentes: continentes.length }),
    t("hud.ticker.intercambio"),
    t("hud.ticker.onu"),
    t("hud.ticker.guitarra"),
  ];
  // Duas cópias seguidas: a animação anda metade da largura e recomeça sem pulo
  // (a segunda cópia fica escondida dos leitores de tela)
  const faixa = (copia) =>
    itens.map((item, i) => (
      <React.Fragment key={`${copia}-${i}`}>
        <span aria-hidden={copia === "b" ? "true" : undefined}>{item}</span>
        <span className="hud-vermelho" aria-hidden="true">
          ///
        </span>
      </React.Fragment>
    ));
  return (
    <div className="hud-ticker">
      <div className="hud-ticker-faixa">
        {faixa("a")}
        {faixa("b")}
      </div>
    </div>
  );
}

const CORES_RECENTES = ["hud-ciano", "hud-vermelho", "hud-amarelo"];

function Taskbar({ onCommand, onFocusTerminal, recent, paused, onLanguageChange }) {
  const { t, i18n } = useTranslation();
  const ajuda = i18n.language.startsWith("en") ? "help" : "ajuda";
  return (
    <footer className="hud-taskbar">
      <button
        type="button"
        className="hud-iniciar"
        title={t("hud.iniciar_dica")}
        disabled={paused}
        onClick={() => onCommand(ajuda)}
      >
        <span aria-hidden="true">&gt;_</span>
        <span className="hud-esconde-celular">Bicalho</span>
      </button>
      <button type="button" className="hud-aba hud-aba-ativa" onClick={onFocusTerminal}>
        <span aria-hidden="true" className="hud-aba-ponto hud-amarelo" />
        terminal.exe
      </button>
      {recent.length > 0 && (
        <ul className="hud-recentes" aria-label={t("hud.recentes")}>
          {recent.map((comando, i) => (
            <li key={comando}>
              <button
                type="button"
                className="hud-aba"
                title={t("hud.repetir", { cmd: comando })}
                disabled={paused}
                onClick={() => onCommand(comando)}
              >
                <span aria-hidden="true" className={`hud-aba-ponto ${CORES_RECENTES[i % 3]}`} />
                <span className="hud-aba-texto">{comando}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <Ticker />
      <div className="hud-bandeja">
        <span className="hud-vermelho hud-esconde-celular">● {t("hud.link")}</span>
        <LanguageSwitcher inline onLanguageChange={onLanguageChange} />
        <Relogio />
      </div>
    </footer>
  );
}

export default function Hud({ children, onCommand, onFocusTerminal, recent, paused, onLanguageChange }) {
  return (
    <div className="hud">
      <div className="hud-fundo" aria-hidden="true">
        <div className="hud-fundo-nome">BICALHO</div>
        <div className="hud-fundo-scan" />
      </div>
      <Cabecalho />
      <div className="hud-corpo">
        <aside className="hud-lateral hud-lateral-esquerda">
          <Perfil />
          <Cyberware />
        </aside>
        <main className="hud-centro">{children}</main>
        <aside className="hud-lateral hud-lateral-direita">
          <Breach />
          <Gigs onCommand={onCommand} paused={paused} />
        </aside>
      </div>
      <Taskbar
        onCommand={onCommand}
        onFocusTerminal={onFocusTerminal}
        recent={recent}
        paused={paused}
        onLanguageChange={onLanguageChange}
      />
    </div>
  );
}
