import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n/mapa";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { MAPA, MAPA_LINHAS } from "../data/mapaAscii";
import { paises, acharPais } from "../data/paisesData";
import { continentes } from "../data/sobreData";
import "./Mapa.css";

// "mapa" (map): mapa-múndi em caracteres (data/mapaAscii.js) com os países
// visitados acesos (data/paisesData.js). O ponto no mapa responde ao mouse;
// a lista de países embaixo é o caminho do teclado e do toque (botões
// grandes), e "mapa <país>" já abre com o país escolhido.

const MARCADOR = "●";

// Linha e coluna de cada país. Dois países na mesma célula (Bélgica e
// Holanda, por exemplo): o segundo vai para a célula livre mais próxima.
function posicionar() {
  const ocupadas = new Set();
  const vizinhos = [
    [0, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
    [1, 0],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, -1],
  ];
  const pos = {};
  for (const pais of paises) {
    const linha = Math.floor((MAPA.LAT0 - pais.lat) / MAPA.DLAT);
    const coluna = Math.floor((pais.lon - MAPA.LON0) / MAPA.DLON);
    for (const [dl, dc] of vizinhos) {
      const chave = `${linha + dl},${coluna + dc}`;
      if (!ocupadas.has(chave)) {
        ocupadas.add(chave);
        pos[chave] = pais;
        break;
      }
    }
  }
  return pos;
}

const Mapa = ({ busca = "" }) => {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  useCommandAtTop(ref);
  const ingles = i18n.language.startsWith("en");

  const inicial = acharPais(busca);
  const [escolhido, setEscolhido] = useState(inicial?.id ?? null);
  const [sobre, setSobre] = useState(null); // país sob o mouse
  const posicoes = useMemo(posicionar, []);

  const ativo = paises.find((p) => p.id === (sobre ?? escolhido));
  const nome = (pais) => t(`sobre.pessoal.lugares.${pais.id}`, { defaultValue: pais.sigla });

  // Cada linha vira pedaços de texto e marcadores
  const linhas = MAPA_LINHAS.map((texto, l) => {
    const cheia = texto.padEnd(MAPA.LARGURA, " ");
    const pedacos = [];
    let resto = "";
    for (let c = 0; c < cheia.length; c++) {
      const pais = posicoes[`${l},${c}`];
      if (!pais) {
        resto += cheia[c];
        continue;
      }
      if (resto) pedacos.push(resto);
      resto = "";
      pedacos.push(pais);
    }
    if (resto) pedacos.push(resto);
    return pedacos;
  });

  return (
    <div className="mapa" ref={ref}>
      <p className="mapa-titulo">{t("mapa.titulo")}</p>
      <p className="mapa-intro">{t("mapa.intro")}</p>
      {busca && !inicial && (
        <p className="mapa-aviso" role="status">
          {t("mapa.nao_achei", { busca })}
        </p>
      )}

      <div className="mapa-quadro" onMouseLeave={() => setSobre(null)}>
        <pre className="mapa-arte" role="img" aria-label={t("mapa.mapa_alt", { count: paises.length })}>
          {linhas.map((pedacos, l) => (
            <span key={l} className="mapa-linha">
              {pedacos.map((pedaco, i) =>
                typeof pedaco === "string" ? (
                  pedaco
                ) : (
                  // Só para o mouse: teclado e leitores de tela usam a lista abaixo
                  <span
                    key={i}
                    aria-hidden="true"
                    className={
                      pedaco.id === ativo?.id ? "mapa-marcador mapa-marcador-ativo" : "mapa-marcador"
                    }
                    onMouseEnter={() => setSobre(pedaco.id)}
                    onClick={() => setEscolhido(pedaco.id)}
                  >
                    {MARCADOR}
                  </span>
                ),
              )}
              {"\n"}
            </span>
          ))}
        </pre>
      </div>

      <p className="mapa-info" aria-live="polite">
        {ativo ? (
          <>
            <span className="mapa-info-nome">
              {nome(ativo)} <span className="mapa-dim">({ativo.sigla})</span>
            </span>{" "}
            {ingles ? ativo.en : ativo.pt}
          </>
        ) : (
          <span className="mapa-dim">{t("mapa.dica")}</span>
        )}
      </p>

      <section aria-labelledby="mapa-paises">
        <h3 id="mapa-paises" className="mapa-rotulo">
          {t("mapa.paises")}{" "}
          <span className="mapa-dim">
            · {t("mapa.resumo", { paises: paises.length, continentes: continentes.length })}
          </span>
        </h3>
        <ul className="mapa-lista">
          {paises.map((pais) => (
            <li key={pais.id}>
              <button
                type="button"
                className={pais.id === escolhido ? "mapa-pais mapa-pais-ativo" : "mapa-pais"}
                aria-pressed={pais.id === escolhido}
                onClick={() => setEscolhido(pais.id)}
                onFocus={() => setSobre(null)}
              >
                {nome(pais)}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Mapa;
