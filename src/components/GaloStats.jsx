import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n/galoStats";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { fetchJogosDoGalo } from "../lib/galo";
import { FUSO_HORARIO } from "../config/fusoHorario";
import { RetroBar } from "../hud/RetroLoader";
import "./Cli.css";
import "./GaloStats.css";

// "galo --stats" (campeonato --stats): os jogos encerrados da temporada, com
// a mesma busca e o mesmo cache da ESPN do "campeonato" (lib/galo.js).
// Aproveitamento, gols pró e contra, saldo, os últimos jogos em V/E/D e os
// gols de cada um. Decisão por pênaltis conta como empate (o placar do jogo).

const ULTIMOS = 10;

function resumir(encerrados) {
  const jogos = encerrados
    .filter((jogo) => Number.isFinite(jogo.galo?.gols) && Number.isFinite(jogo.adversario?.gols))
    .map((jogo) => {
      const pro = jogo.galo.gols;
      const contra = jogo.adversario.gols;
      return { ...jogo, pro, contra, resultado: pro > contra ? "v" : pro < contra ? "d" : "e" };
    });
  const conta = (r) => jogos.filter((jogo) => jogo.resultado === r).length;
  const v = conta("v");
  const e = conta("e");
  const pro = jogos.reduce((soma, jogo) => soma + jogo.pro, 0);
  const contra = jogos.reduce((soma, jogo) => soma + jogo.contra, 0);
  return {
    jogos,
    total: jogos.length,
    v,
    e,
    d: conta("d"),
    pro,
    contra,
    aproveitamento: jogos.length ? Math.round(((3 * v + e) / (3 * jogos.length)) * 100) : 0,
    ultimos: jogos.slice(-ULTIMOS),
  };
}

const GaloStats = () => {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  useCommandAtTop(ref);
  const [estado, setEstado] = useState("carregando");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let vivo = true;
    fetchJogosDoGalo()
      .then(({ encerrados }) => {
        if (!vivo) return;
        setStats(resumir(encerrados ?? []));
        setEstado("pronto");
      })
      .catch(() => vivo && setEstado("erro"));
    return () => {
      vivo = false;
    };
  }, []);

  const locale = i18n.language.startsWith("en") ? "en-US" : "pt-BR";
  const diaMes = new Intl.DateTimeFormat(locale, {
    timeZone: FUSO_HORARIO,
    day: "2-digit",
    month: "2-digit",
  });
  const sinal = (n) => (n > 0 ? `+${n}` : String(n));

  return (
    <div className="galostats" ref={ref}>
      <p className="galostats-titulo">{t("galostats.titulo")}</p>
      <p className="galostats-intro">{t("galostats.intro")}</p>

      {estado === "carregando" && (
        <p className="cli-hint" role="status">
          {t("galostats.carregando")}
        </p>
      )}
      {estado === "erro" && <p className="cli-hint">{t("galostats.erro")}</p>}
      {estado === "pronto" && stats.total === 0 && <p className="cli-hint">{t("galostats.vazio")}</p>}

      {estado === "pronto" && stats.total > 0 && (
        <>
          <div className="galostats-aproveitamento">
            <p className="galostats-rotulo">{t("galostats.aproveitamento")}</p>
            <RetroBar value={stats.aproveitamento} label={t("galostats.aproveitamento")} />
            <p className="galostats-numero">
              {t("galostats.aproveitamento_valor", { pct: stats.aproveitamento })}
            </p>
          </div>

          <dl className="galostats-numeros">
            <div>
              <dt>{t("galostats.jogos")}</dt>
              <dd>
                {stats.total}{" "}
                <span className="galostats-dim">
                  ({t("galostats.campanha", { v: stats.v, e: stats.e, d: stats.d })})
                </span>
              </dd>
            </div>
            <div>
              <dt>{t("galostats.gols_pro")}</dt>
              <dd>{stats.pro}</dd>
            </div>
            <div>
              <dt>{t("galostats.gols_contra")}</dt>
              <dd>{stats.contra}</dd>
            </div>
            <div>
              <dt>{t("galostats.saldo")}</dt>
              <dd>{sinal(stats.pro - stats.contra)}</dd>
            </div>
          </dl>

          <section className="galostats-secao" aria-labelledby="galostats-ultimos">
            <h3 id="galostats-ultimos" className="galostats-rotulo">
              {t("galostats.ultimos", { count: stats.ultimos.length })}
            </h3>
            <ol className="galostats-forma" aria-label={t("galostats.ultimos_lista")}>
              {stats.ultimos.map((jogo) => (
                <li
                  key={jogo.id}
                  className={`galostats-letra galostats-${jogo.resultado}`}
                  title={`${jogo.pro}×${jogo.contra} ${t("galostats.contra", { time: jogo.adversario?.curto ?? "?" })}`}
                >
                  <span aria-hidden="true">{t(`galostats.letra.${jogo.resultado}`)}</span>
                  <span className="galostats-sr">
                    {t(`galostats.resultado.${jogo.resultado}`)} {jogo.pro}×{jogo.contra}{" "}
                    {t("galostats.contra", { time: jogo.adversario?.curto ?? "?" })}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="galostats-secao" aria-labelledby="galostats-porjogo">
            <h3 id="galostats-porjogo" className="galostats-rotulo">
              {t("galostats.por_jogo")}
            </h3>
            <ol className="galostats-gols" aria-label={t("galostats.por_jogo_lista")}>
              {stats.ultimos.map((jogo) => (
                <li key={jogo.id}>
                  <span className="galostats-data">{diaMes.format(jogo.data)}</span>
                  <span className="galostats-adversario">{jogo.adversario?.sigla || jogo.adversario?.curto}</span>
                  <span className={`galostats-placar galostats-${jogo.resultado}`}>
                    {jogo.pro}×{jogo.contra}
                  </span>
                  <span className="galostats-barras" aria-hidden="true">
                    <span className="galostats-pro">{"█".repeat(Math.min(jogo.pro, 10))}</span>
                    <span className="galostats-contra">{"▒".repeat(Math.min(jogo.contra, 10))}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="galostats-dim galostats-legenda">{t("galostats.legenda")}</p>
          </section>

          <p className="galostats-dim galostats-legenda">{t("galostats.fonte")}</p>
        </>
      )}
    </div>
  );
};

export default GaloStats;
