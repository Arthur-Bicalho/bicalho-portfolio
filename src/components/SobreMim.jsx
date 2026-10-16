import React, { useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { TypeAnimation } from "react-type-animation";
import { FaLaptopCode, FaRocket, FaTheaterMasks } from "react-icons/fa";
import { SiCodeforces } from "react-icons/si";
import { GiGuitar } from "react-icons/gi";
import {
  IoAirplaneOutline,
  IoBriefcaseOutline,
  IoFootballOutline,
  IoGameControllerOutline,
  IoHeadsetOutline,
  IoGlobeOutline,
  IoLanguageOutline,
  IoLocationOutline,
  IoMusicalNotesOutline,
  IoSchoolOutline,
  IoStarOutline,
} from "react-icons/io5";
import { TbCake, TbCertificate, TbZodiacVirgo } from "react-icons/tb";
import useCommandAtTop from "../terminal/useCommandAtTop";
import {
  AVATAR,
  COMANDO_EN,
  GALO_URL,
  INICIAIS,
  NASCIMENTO,
  continentes,
  destaques,
  formacao,
  hobbies,
  hoje,
  idiomas,
  interesses,
  vejaTambem,
} from "../data/sobreData";
import "./SobreMim.css";

// A cor de cada bloco vem de um token do theme.css, passada como --serie:
// a cor marca o bloco (borda, ícone, ponto), os textos ficam sempre nos
// tokens de texto.
const serie = (token) => ({ "--serie": `var(${token})` });

// Idade de hoje: um ano a menos enquanto o aniversário deste ano não chegou
const IDADE = (() => {
  const data = new Date();
  const { ano, mes, dia } = NASCIMENTO;
  const mesAtual = data.getMonth() + 1;
  const jaFez = mesAtual > mes || (mesAtual === mes && data.getDate() >= dia);
  return data.getFullYear() - ano - (jaFez ? 0 : 1);
})();

const LUGARES = continentes.reduce((total, c) => total + c.lugares.length, 0);

// Ícone de cada item do "hoje" (sem logo cadastrado)
const HOJE_ICONES = {
  puc: IoSchoolOutline,
  webtech: IoBriefcaseOutline,
};

// Ícone de cada destaque
const DESTAQUE_ICONES = {
  onu: IoGlobeOutline,
  teatro: FaTheaterMasks,
  codeforces: SiCodeforces,
};

const HOBBY_ICONES = {
  guitarra: GiGuitar,
  projetos: FaLaptopCode,
  musica: IoMusicalNotesOutline,
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function Link({ href, className, children, ...rest }) {
  // Sem endereço (ex.: Álamo TI): texto comum, sem o sublinhado de link
  if (!href) {
    const semLink = className
      ?.split(" ")
      .filter((nome) => !nome.startsWith("sobre-link"))
      .join(" ");
    return <span className={semLink || undefined}>{children}</span>;
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...rest}>
      {children}
    </a>
  );
}

// "$ lattes": dica do comando que aprofunda o bloco.
// Quebra só entre as palavras, nunca no meio delas.
function Cmd({ children, className = "" }) {
  const partes = children.split(" ");
  return (
    <code className={`sobre-cmd ${className}`}>
      {partes.map((parte, i) => (
        <React.Fragment key={i}>
          {i > 0 && " "}
          <span>{parte}</span>
        </React.Fragment>
      ))}
    </code>
  );
}

function Secao({ titulo, cmd, children }) {
  return (
    <section className="sobre-secao">
      <h4 className="sobre-secao-titulo">
        <span>{titulo}</span>
        {cmd && <Cmd>{cmd}</Cmd>}
      </h4>
      {children}
    </section>
  );
}

/* ---------- Cabeçalho ---------- */

// O lema (sobre.lema_1 e sobre.lema_2), digitado. O texto
// completo fica invisível na mesma célula do grid: a altura não pula.
function Lema() {
  const { t, i18n } = useTranslation();
  const [estatico] = useState(prefersReducedMotion);
  const parte1 = t("sobre.lema_1");
  const completo = `${parte1} ${t("sobre.lema_2")}`;

  return (
    <p className="sobre-lema">
      <span className="sobre-lema-reserva" aria-hidden="true">
        {"// "}
        {completo}
      </span>
      {estatico ? (
        <span className="sobre-lema-texto">
          {"// "}
          {completo}
        </span>
      ) : (
        <>
          <span className="sobre-sr">{completo}</span>
          <TypeAnimation
            key={i18n.language}
            sequence={[`// ${parte1}`, 700, `// ${completo}`]}
            wrapper="span"
            cursor
            repeat={0}
            speed={60}
            className="sobre-lema-texto"
            aria-hidden="true"
          />
        </>
      )}
    </p>
  );
}

function Avatar() {
  const { t } = useTranslation();
  if (AVATAR) {
    return (
      <img
        src={AVATAR}
        alt={t("sobre.avatar_alt")}
        className="sobre-avatar"
        width="180"
        height="180"
      />
    );
  }
  // Sem foto: as iniciais no lugar, no mesmo círculo
  return (
    <span className="sobre-avatar sobre-avatar-iniciais" role="img" aria-label={t("sobre.avatar_alt")}>
      {INICIAIS}
    </span>
  );
}

function Cabecalho() {
  const { t } = useTranslation();
  return (
    <header className="sobre-cabecalho">
      <Avatar />
      <div className="sobre-identidade">
        <h3 className="sobre-nome">{t("sobre.nome")}</h3>
        <p className="sobre-cargo">{t("sobre.cargo")}</p>
        <Lema />
        <ul className="sobre-chips">
          <li className="sobre-chip-idade" style={serie("--icon-book")}>
            <TbCake aria-hidden="true" />
            {t("sobre.idade", { count: IDADE })}
          </li>
          <li style={serie("--icon-location")}>
            <IoLocationOutline aria-hidden="true" />
            {t("sobre.local")}
          </li>
          <li style={serie("--info")}>
            <TbZodiacVirgo aria-hidden="true" />
            {t("sobre.signo")}
          </li>
        </ul>
      </div>
    </header>
  );
}

/* ---------- Hoje ---------- */

// Logo da organização ou, sem logo, um ícone na cor do bloco
function Marca({ logo, cor, alt, icone }) {
  const Icone = icone ?? FaRocket;
  if (logo) {
    return (
      <img src={logo} alt={alt} className="sobre-logo" loading="lazy" width="40" height="40" />
    );
  }
  return (
    <span className="sobre-logo sobre-logo-icone" style={serie(cor)} aria-hidden="true">
      <Icone />
    </span>
  );
}

// Lista "cargo na organização · detalhe": usada no "hoje" e nos "destaques"
function ListaAtuacao({ itens, ns, icones }) {
  const { t } = useTranslation();
  return (
    <ul className="sobre-hoje">
      {itens.map((item) => (
        <li key={item.id} className="sobre-hoje-item">
          <Marca
            logo={item.logo}
            cor={item.cor}
            alt={t(`sobre.${ns}.${item.id}.org`)}
            icone={icones[item.id]}
          />
          <div className="sobre-hoje-texto">
            <p className="sobre-hoje-cargo">
              {t(`sobre.${ns}.${item.id}.cargo`)}{" "}
              <span className="sobre-hoje-em">
                {t(`sobre.${ns}.${item.id}.em`, { defaultValue: t("sobre.hoje.em") })}
              </span>{" "}
              <Link href={item.url} className="sobre-link-forte">
                {t(`sobre.${ns}.${item.id}.org`)}
              </Link>
            </p>
            <p className="sobre-hoje-detalhe">{t(`sobre.${ns}.${item.id}.detalhe`)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Idiomas e interesses ---------- */

function Idiomas() {
  const { t } = useTranslation();
  return (
    <dl className="sobre-kv">
      {idiomas.map((id) => (
        <div key={id} className="sobre-kv-linha" style={serie("--info")}>
          <dt>
            <IoLanguageOutline aria-hidden="true" />
            {t(`sobre.idiomas.${id}.nome`)}
          </dt>
          <dd>{t(`sobre.idiomas.${id}.nivel`)}</dd>
        </div>
      ))}
      <div className="sobre-kv-linha" style={serie("--highlight")}>
        <dt>
          <IoStarOutline aria-hidden="true" />
          {t("sobre.interesses_rotulo")}
        </dt>
        <dd>
          <span className="sobre-lista-ponto">
            {interesses.map((id) => (
              <span key={id}>{t(`sobre.interesses.${id}`)}</span>
            ))}
          </span>
        </dd>
      </div>
    </dl>
  );
}

/* ---------- Formação ---------- */

// "2025 – em andamento", "2021 – 2023", "2023" ou nada, sem anos cadastrados
function Periodo({ inicio, fim }) {
  const { t } = useTranslation();
  if (fim === null) {
    return <>{inicio ? `${inicio} – ` : ""}{t("sobre.formacao.em_andamento")}</>;
  }
  if (!inicio && !fim) return null;
  if (!inicio || fim === inicio) return <>{inicio ?? fim}</>;
  return (
    <>
      {inicio} – {fim}
    </>
  );
}

function Formacao() {
  const { t } = useTranslation();
  return (
    <ul className="sobre-formacao">
      {formacao.map((item) => (
        <li key={item.id} className="sobre-diploma">
          <Marca
            logo={item.logo}
            cor={item.cor}
            alt={t(`sobre.formacao.${item.id}.org`)}
            icone={TbCertificate}
          />
          <div className="sobre-diploma-texto">
            <span className="sobre-marco-periodo">
              <Periodo inicio={item.inicio} fim={item.fim} />
            </span>
            <span className="sobre-diploma-nivel">{t(`sobre.formacao.${item.id}.nivel`)}</span>
            {t(`sobre.formacao.${item.id}.curso`, { defaultValue: "" }) && (
              <span className="sobre-diploma-curso">{t(`sobre.formacao.${item.id}.curso`)}</span>
            )}
            <Link href={item.url} className="sobre-link sobre-diploma-org">
              {t(`sobre.formacao.${item.id}.org`)}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Fora do terminal ---------- */

function Pessoal() {
  const { t } = useTranslation();
  const linhas = [
    {
      id: "time",
      Icon: IoFootballOutline,
      cor: "--icon-github", // preto e branco, nos dois temas
      valor: (
        <>
          <Trans
            i18nKey="sobre.pessoal.time"
            components={{ galo: <Link href={GALO_URL} className="sobre-link" /> }}
          />{" "}
          <Cmd className="sobre-cmd-inline">neofetch</Cmd>{" "}
          <Cmd className="sobre-cmd-inline">galo</Cmd>
        </>
      ),
    },
    {
      id: "hobbies",
      Icon: IoGameControllerOutline,
      cor: "--highlight",
      valor: (
        <>
          <span>
            {hobbies.map(({ id, url }) => {
              const Icon = HOBBY_ICONES[id];
              const conteudo = (
                <>
                  <Icon aria-hidden="true" />
                  {t(`sobre.pessoal.hobbies.${id}`)}
                </>
              );
              return url ? (
                <Link key={id} href={url} className="sobre-link sobre-hobby">
                  {conteudo}
                </Link>
              ) : (
                <span key={id} className="sobre-hobby">
                  {conteudo}
                </span>
              );
            })}
          </span>
          <Cmd className="sobre-cmd-inline">jogo</Cmd>
        </>
      ),
    },
    {
      id: "musica",
      Icon: IoHeadsetOutline,
      cor: "--warn",
      valor: (
        <>
          <span>{t("sobre.pessoal.musica")}</span>{" "}
          <Cmd className="sobre-cmd-inline">spotify</Cmd>
        </>
      ),
    },
  ];

  return (
    <dl className="sobre-kv">
      {linhas.map((linha) => {
        const { id, cor, valor } = linha;
        const Icon = linha.Icon;
        return (
          <div key={id} className="sobre-kv-linha" style={serie(cor)}>
            <dt>
              <Icon aria-hidden="true" />
              {t(`sobre.pessoal.rotulos.${id}`)}
            </dt>
            <dd>{valor}</dd>
          </div>
        );
      })}
    </dl>
  );
}

function Passaporte() {
  const { t } = useTranslation();
  return (
    <div className="sobre-passaporte">
      <p className="sobre-passaporte-titulo">
        <IoAirplaneOutline aria-hidden="true" />
        <span>{t("sobre.pessoal.passaporte")}</span>
        <span className="sobre-passaporte-total">
          {t("sobre.pessoal.passaporte_total", {
            lugares: LUGARES,
            continentes: continentes.length,
          })}
        </span>
      </p>

      {/* Uma faixa por continente, do tamanho da quantidade de lugares */}
      <div className="sobre-faixa" aria-hidden="true">
        {continentes.map((c) => (
          <span
            key={c.id}
            className="sobre-faixa-seg"
            style={{ ...serie(c.cor), flexGrow: c.lugares.length }}
            title={`${t(`sobre.pessoal.continentes.${c.id}`)} · ${c.lugares.length}`}
          />
        ))}
      </div>

      <div className="sobre-continentes">
        {continentes.map((c) => (
          <div key={c.id} className="sobre-continente" style={serie(c.cor)}>
            <p className="sobre-continente-nome">
              <span className="sobre-quadrado" aria-hidden="true" />
              {t(`sobre.pessoal.continentes.${c.id}`)}
              <span className="sobre-inst-conta">{c.lugares.length}</span>
            </p>
            <ul className="sobre-carimbos">
              {c.lugares.map((lugar) => {
                const Bandeira = lugar.Bandeira;
                return (
                  <li key={lugar.id} className="sobre-carimbo" title={lugar.sigla}>
                    <Bandeira className="sobre-bandeira" aria-hidden="true" />
                    {t(`sobre.pessoal.lugares.${lugar.id}`)}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Página ---------- */

const SobreMim = () => {
  const { t, i18n } = useTranslation();
  const ingles = i18n.language.startsWith("en");
  const comando = (nome) => (ingles ? (COMANDO_EN[nome] ?? nome) : nome);
  const b = { b: <strong /> };
  const painelRef = useRef(null);

  // Comando no topo, com a saída abaixo (ver terminal/useCommandAtTop.js)
  useCommandAtTop(painelRef);

  return (
    <article className="sobre-painel" ref={painelRef}>
      <Cabecalho />

      <div className="sobre-bio">
        <p>
          <Trans i18nKey="sobre.bio_1" components={b} />
        </p>
      </div>

      <Secao titulo={t("sobre.secoes.hoje")}>
        <ListaAtuacao itens={hoje} ns="hoje" icones={HOJE_ICONES} />
      </Secao>

      <Secao titulo={t("sobre.secoes.formacao")} cmd="lattes">
        <Formacao />
      </Secao>

      <Secao titulo={t("sobre.secoes.destaques")}>
        <ListaAtuacao itens={destaques} ns="destaques" icones={DESTAQUE_ICONES} />
      </Secao>

      <Secao titulo={t("sobre.secoes.idiomas")}>
        <Idiomas />
      </Secao>

      <Secao titulo={t("sobre.secoes.pessoal")}>
        <Pessoal />
        <Passaporte />
      </Secao>

      <nav className="sobre-rodape" aria-label={t("sobre.veja_tambem")}>
        <span className="sobre-rodape-rotulo">{t("sobre.veja_tambem")}</span>
        {vejaTambem.map((nome) => (
          <code key={nome}>{comando(nome)}</code>
        ))}
      </nav>
    </article>
  );
};

export default SobreMim;
