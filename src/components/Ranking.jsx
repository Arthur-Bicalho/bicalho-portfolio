import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n/ranking";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { obterSupabase, supabaseConfigurado } from "../lib/supabase";
import "./Cli.css";
import "./Ranking.css";

// "ranking" (top): os comandos mais usados, num gráfico de barras feito de
// caracteres. Cada visita conta no máximo uma vez por comando
// (lib/ranking.js e supabase/ranking_comandos.sql).

const TOP = 10;
const LARGURA = 24; // caracteres da maior barra

// Barra em texto: blocos cheios e, na ponta, a fração em ▓ ▒ ░
const FRACOES = ["", "░", "▒", "▓"];
function barra(valor, maximo, largura = LARGURA) {
  if (!maximo || valor <= 0) return "";
  const exato = (valor / maximo) * largura;
  const cheios = Math.floor(exato);
  const fracao = FRACOES[Math.round((exato - cheios) * 4)] ?? "█";
  const texto = "█".repeat(cheios) + fracao;
  return texto || "░"; // um valor pequeno ainda aparece
}

const Ranking = () => {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  useCommandAtTop(ref);
  const [estado, setEstado] = useState(supabaseConfigurado ? "carregando" : "sem_banco");
  const [linhas, setLinhas] = useState([]);

  useEffect(() => {
    if (!supabaseConfigurado) return undefined;
    let vivo = true;
    obterSupabase()
      .then((supabase) =>
        supabase
          ? supabase
              .from("ranking_comandos")
              .select("nome, total")
              .gt("total", 0)
              .order("total", { ascending: false })
              .order("nome", { ascending: true })
              .limit(TOP)
          : { error: true },
      )
      .then(({ data, error }) => {
        if (!vivo) return;
        if (error) {
          setEstado("erro");
          return;
        }
        setLinhas(data ?? []);
        setEstado("pronto");
      });
    return () => {
      vivo = false;
    };
  }, []);

  const locale = i18n.language.startsWith("en") ? "en-US" : "pt-BR";
  const maximo = linhas[0]?.total ?? 0;
  const largura = Math.max(...linhas.map((l) => l.nome.length), 4);

  return (
    <div className="ranking" ref={ref}>
      <p className="ranking-titulo">{t("ranking.titulo")}</p>
      <p className="ranking-intro">{t("ranking.intro")}</p>

      {estado === "sem_banco" && <p className="cli-hint">{t("ranking.nao_configurado")}</p>}
      {estado === "carregando" && (
        <p className="cli-hint" role="status">
          {t("ranking.carregando")}
        </p>
      )}
      {estado === "erro" && <p className="cli-hint">{t("ranking.erro")}</p>}
      {estado === "pronto" && linhas.length === 0 && <p className="cli-hint">{t("ranking.vazio")}</p>}

      {estado === "pronto" && linhas.length > 0 && (
        <ol
          className="ranking-lista"
          aria-label={t("ranking.lista")}
          style={{ "--largura-nome": `${largura}ch` }}
        >
          {linhas.map((linha, i) => (
            <li key={linha.nome} className="ranking-item" style={{ "--i": i }}>
              <span className="ranking-posicao" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="ranking-nome">
                {linha.nome}
              </span>
              <span className="ranking-barra" aria-hidden="true">
                {barra(linha.total, maximo)}
              </span>
              <span className="ranking-total">
                {t("ranking.vezes", { count: linha.total, n: linha.total.toLocaleString(locale) })}
              </span>
            </li>
          ))}
        </ol>
      )}

      <p className="ranking-nota">{t("ranking.nota")}</p>
    </div>
  );
};

export default Ranking;
