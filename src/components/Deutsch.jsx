import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n/deutsch";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { palavras, indiceDoDia } from "../data/deutschData";
import "./Deutsch.css";

// "deutsch": a palavra alemã "intraduzível" do dia (data/deutschData.js),
// escolhida pela data e igual para todos. "deutsch --zufall" sorteia outra,
// diferente da do dia.

function sortear() {
  const hoje = indiceDoDia();
  const outra = Math.floor(Math.random() * (palavras.length - 1));
  return outra >= hoje ? outra + 1 : outra;
}

const Deutsch = ({ zufall = false }) => {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  useCommandAtTop(ref);
  const ingles = i18n.language.startsWith("en");
  // Sorteada uma vez: a saída não muda se o terminal renderizar de novo
  const [indice] = useState(() => (zufall ? sortear() : indiceDoDia()));
  const palavra = palavras[indice];

  return (
    <div className="deutsch" ref={ref}>
      <p className="deutsch-titulo">{zufall ? t("deutsch.titulo_zufall") : t("deutsch.titulo")}</p>

      <div className="deutsch-cartao">
        <p className="deutsch-palavra" lang="de">
          {palavra.palavra}
        </p>
        <dl className="deutsch-dados">
          <div>
            <dt>{t("deutsch.pronuncia")}</dt>
            <dd>/{palavra.pronuncia}/</dd>
          </div>
          <div>
            <dt>{t("deutsch.significado")}</dt>
            <dd>{ingles ? palavra.en : palavra.pt}</dd>
          </div>
          <div>
            <dt>{t("deutsch.exemplo")}</dt>
            <dd>
              <span className="deutsch-exemplo" lang="de">
                „{palavra.exemplo}“
              </span>
              <span className="deutsch-traducao">{ingles ? palavra.exemploEn : palavra.exemploPt}</span>
            </dd>
          </div>
        </dl>
      </div>

      <p className="deutsch-dica">
        {t("deutsch.contador", { n: indice + 1, total: palavras.length })} ·{" "}
        {zufall ? t("deutsch.dica_zufall") : t("deutsch.dica_dia")}
      </p>
    </div>
  );
};

export default Deutsch;
