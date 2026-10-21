import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n/whoami";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { obterClima } from "../lib/clima";
import "./Whoami.css";

// "whoami": o que qualquer site lê sem pedir permissão. A cidade vem do
// /api/clima (a mesma chamada da boas-vindas, já em cache); o resto sai do
// próprio navegador. Nada é enviado nem guardado.

// Nome e versão principal do navegador pelo user agent. A ordem importa: o
// Edge e o Opera também dizem "Chrome", e o Chrome também diz "Safari".
const NAVEGADORES = [
  ["Edge", /Edg(?:e|A|iOS)?\/(\d+)/],
  ["Opera", /OPR\/(\d+)/],
  ["Samsung Internet", /SamsungBrowser\/(\d+)/],
  ["Firefox", /(?:Firefox|FxiOS)\/(\d+)/],
  ["Chrome", /(?:Chrome|CriOS)\/(\d+)/],
  ["Safari", /Version\/(\d+).*Safari/],
];

const SISTEMAS = [
  ["Android", /Android/],
  ["iOS", /iPhone|iPad|iPod/],
  ["Windows", /Windows/],
  ["macOS", /Mac OS X|Macintosh/],
  ["ChromeOS", /CrOS/],
  ["Linux", /Linux/],
];

const primeiro = (lista, ua) => {
  for (const [nome, regex] of lista) {
    const achou = ua.match(regex);
    if (achou) return achou[1] ? `${nome} ${achou[1]}` : nome;
  }
  return null;
};

function lerNavegador() {
  const n = navigator;
  const ua = n.userAgent ?? "";
  const media = (q) => window.matchMedia?.(q).matches;
  let fuso = null;
  try {
    fuso = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    // sem Intl: fica "não informado"
  }
  return {
    ua,
    navegador: primeiro(NAVEGADORES, ua),
    sistema: n.userAgentData?.platform || primeiro(SISTEMAS, ua),
    idiomas: (n.languages?.length ? n.languages : [n.language]).filter(Boolean).join(", "),
    fuso,
    tela: `${screen.width}×${screen.height} @${window.devicePixelRatio ?? 1}x`,
    janela: `${window.innerWidth}×${window.innerHeight}`,
    nucleos: n.hardwareConcurrency,
    memoria: n.deviceMemory,
    toque: n.maxTouchPoints ?? 0,
    conexao: n.connection?.effectiveType,
    escuro: media("(prefers-color-scheme: dark)"),
    dnt: n.doNotTrack === "1" || window.doNotTrack === "1",
    gpc: n.globalPrivacyControl === true,
    cookies: n.cookieEnabled,
    origem: document.referrer,
  };
}

const Whoami = () => {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  useCommandAtTop(ref);
  const [dados] = useState(lerNavegador);
  const [cidade, setCidade] = useState(undefined); // undefined = carregando

  useEffect(() => {
    let vivo = true;
    obterClima().then((clima) => {
      if (!vivo) return;
      setCidade(clima ? [clima.cidade, clima.regiao, clima.pais].filter(Boolean).join(", ") : null);
    });
    return () => {
      vivo = false;
    };
  }, []);

  const sem = t("whoami.desconhecido");
  const simNao = (v) => (v ? t("whoami.sim") : t("whoami.nao"));
  const ligado = (v) => (v ? t("whoami.ligado") : t("whoami.desligado"));
  const locale = i18n.language.startsWith("en") ? "en-US" : "pt-BR";
  const hora = new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });

  const campos = [
    ["cidade", cidade === undefined ? t("whoami.carregando") : cidade || sem],
    ["navegador", dados.navegador || sem],
    ["sistema", dados.sistema || sem],
    ["ua", dados.ua || sem],
    ["idiomas", dados.idiomas || sem],
    ["fuso", dados.fuso || sem],
    ["hora", hora],
    ["tela", dados.tela],
    ["janela", dados.janela],
    ["nucleos", dados.nucleos || sem],
    ["memoria", dados.memoria ? t("whoami.memoria_valor", { gb: dados.memoria }) : sem],
    ["toque", dados.toque > 0 ? t("whoami.toque_valor", { n: dados.toque }) : t("whoami.nao")],
    ["conexao", dados.conexao || sem],
    ["tema", dados.escuro ? t("whoami.tema_escuro") : t("whoami.tema_claro")],
    ["dnt", ligado(dados.dnt)],
    ["gpc", ligado(dados.gpc)],
    ["cookies", simNao(dados.cookies)],
    ["origem", dados.origem || t("whoami.origem_direto")],
  ];

  return (
    <div className="whoami" ref={ref}>
      <p className="whoami-titulo">{t("whoami.titulo")}</p>
      <p className="whoami-intro">{t("whoami.intro")}</p>

      <dl className="whoami-dados">
        {campos.map(([chave, valor]) => (
          <div key={chave} className="whoami-linha">
            <dt>{t(`whoami.campos.${chave}`)}</dt>
            <dd className={chave === "ua" ? "whoami-ua" : undefined}>{valor}</dd>
          </div>
        ))}
      </dl>

      <p className="whoami-aviso">{t("whoami.aviso")}</p>

      <section className="whoami-secao" aria-labelledby="whoami-fingerprint">
        <h3 id="whoami-fingerprint" className="whoami-rotulo">
          {t("whoami.fingerprint_titulo")}
        </h3>
        <p>{t("whoami.fingerprint")}</p>
      </section>

      <section className="whoami-secao" aria-labelledby="whoami-dicas">
        <h3 id="whoami-dicas" className="whoami-rotulo">
          {t("whoami.dicas_titulo")}
        </h3>
        <ul className="whoami-dicas">
          {["navegador", "gpc", "bloqueador", "vpn", "cookies"].map((dica) => (
            <li key={dica}>{t(`whoami.dicas.${dica}`)}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Whoami;
