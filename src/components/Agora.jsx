import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n/agora";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { agora, atualizado } from "../data/agoraData";
import { fetchGitHub, GitHubRateLimitError } from "../lib/githubApi";
import { githubPaths } from "../lib/githubPaths";
import "./Cli.css";
import "./Agora.css";

// "agora" (now): a lista de data/agoraData.js e o último push público, dos
// eventos recentes da GitHub API (/users/<usuário>/events/public, um dos
// caminhos fixos do proxy em lib/githubPaths.js).

const REPO = /^[\w.-]+\/[\w.-]+$/;
const SHA = /^[0-9a-f]{7,40}$/;

// Primeiro PushEvent dos eventos (a API devolve do mais novo ao mais antigo)
function ultimoPush(eventos) {
  const push = (Array.isArray(eventos) ? eventos : []).find((e) => e?.type === "PushEvent");
  if (!push || !REPO.test(push.repo?.name ?? "")) return null;
  const commits = Array.isArray(push.payload?.commits) ? push.payload.commits : [];
  const head = push.payload?.head;
  return {
    repo: push.repo.name,
    branch: String(push.payload?.ref ?? "").replace(/^refs\/heads\//, ""),
    // A primeira linha da mensagem do commit mais recente do push
    mensagem: String(commits.at(-1)?.message ?? "").split("\n")[0].slice(0, 140),
    commits: push.payload?.size ?? commits.length,
    em: Date.parse(push.created_at),
    link: SHA.test(head ?? "")
      ? `https://github.com/${push.repo.name}/commit/${head}`
      : `https://github.com/${push.repo.name}`,
  };
}

// "há 3 horas" / "3 hours ago"
function tempoRelativo(ms, locale) {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const seg = Math.round((ms - Date.now()) / 1000);
  const passos = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [30, "day"],
    [12, "month"],
    [Infinity, "year"],
  ];
  let valor = seg;
  for (const [tamanho, unidade] of passos) {
    if (Math.abs(valor) < tamanho) return rtf.format(valor, unidade);
    valor = Math.round(valor / tamanho);
  }
  return "";
}

const Agora = () => {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  useCommandAtTop(ref);
  const [estado, setEstado] = useState("carregando");
  const [push, setPush] = useState(null);

  useEffect(() => {
    let vivo = true;
    fetchGitHub(githubPaths.events())
      .then((eventos) => {
        if (!vivo) return;
        setPush(ultimoPush(eventos));
        setEstado("pronto");
      })
      .catch((error) => {
        if (vivo) setEstado(error instanceof GitHubRateLimitError ? "limite" : "erro");
      });
    return () => {
      vivo = false;
    };
  }, []);

  const ingles = i18n.language.startsWith("en");
  const locale = ingles ? "en-US" : "pt-BR";
  const [ano, mes] = atualizado.split("-").map(Number);
  const dataAtualizado = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
    new Date(ano, mes - 1, 1),
  );

  return (
    <div className="agora" ref={ref}>
      <p className="agora-titulo">{t("agora.titulo")}</p>
      <p className="agora-intro">{t("agora.intro")}</p>

      <dl className="agora-lista">
        {agora.map((item) => (
          <div key={item.id} className="agora-item">
            <dt>{t(`agora.itens.${item.id}`, { defaultValue: item.id })}</dt>
            <dd>{ingles ? item.en : item.pt}</dd>
          </div>
        ))}
      </dl>

      <section className="agora-push" aria-labelledby="agora-push-titulo">
        <h3 id="agora-push-titulo" className="agora-rotulo">
          {t("agora.push_titulo")}
        </h3>
        {estado === "carregando" && (
          <p className="cli-hint" role="status">
            {t("agora.carregando")}
          </p>
        )}
        {estado === "erro" && <p className="cli-hint">{t("agora.erro")}</p>}
        {estado === "limite" && <p className="cli-hint">{t("agora.limite")}</p>}
        {estado === "pronto" && !push && <p className="cli-hint">{t("agora.sem_push")}</p>}
        {estado === "pronto" && push && (
          <>
            <p className="agora-push-linha">
              <span className="agora-push-repo">{push.repo}</span>
              {push.branch && <span className="agora-dim"> ({push.branch})</span>}
              {Number.isFinite(push.em) && (
                <time className="agora-dim" dateTime={new Date(push.em).toISOString()}>
                  {" · "}
                  {tempoRelativo(push.em, locale)}
                </time>
              )}
            </p>
            {push.mensagem && <p className="agora-push-mensagem">“{push.mensagem}”</p>}
            <p className="agora-dim">
              {push.commits > 0 && `${t("agora.commits", { count: push.commits })} · `}
              <a href={push.link} target="_blank" rel="noopener noreferrer">
                {t("agora.ver")}
              </a>
            </p>
          </>
        )}
      </section>

      <p className="agora-rodape">{t("agora.atualizado", { data: dataAtualizado })}</p>
    </div>
  );
};

export default Agora;
