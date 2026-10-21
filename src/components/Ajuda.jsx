import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { commandList, categorias } from "../commands";
import useCommandAtTop from "../terminal/useCommandAtTop";
import "./Ajuda.css";

const comandos = Object.values(commandList);

// "ajuda": a tabela dos comandos principais e, embaixo, uma linha por
// categoria só com os nomes (segurança: hack · ctf · ...), para tudo caber na
// tela. "ajuda --tudo" (tudo) mostra a tabela completa, com as descrições.
const Ajuda = ({ tudo = false }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  useCommandAtTop(ref);
  const tabela = tudo ? comandos : comandos.filter((cmd) => !cmd.categoria);
  return (
    <div className="ajuda-container" ref={ref}>
      <p className="ajuda-titulo">{t("ajuda.titulo")}</p>
      {/* Tabela de duas colunas (comando | descrição), como um --help */}
      <div className="ajuda-lista">
        {tabela.map((cmd) => {
          const allAliases = [cmd.name, ...cmd.aliases].join(" | ");
          return (
            <div key={`help-${cmd.name}`} className="ajuda-item">
              <div className="ajuda-aliases">
                <span className="ajuda-aliases-symbol">&gt;</span>
                <span>{allAliases}</span>
              </div>
              <span className="ajuda-description">- {t(`ajuda.${cmd.name}.desc`)}</span>
            </div>
          );
        })}
        {!tudo &&
          categorias.map((categoria) => (
            <div key={`help-${categoria}`} className="ajuda-item">
              <div className="ajuda-aliases">
                <span className="ajuda-aliases-symbol">&gt;</span>
                <span>{t(`ajuda.categoria.${categoria}`)}</span>
              </div>
              <span className="ajuda-description">
                {comandos
                  .filter((cmd) => cmd.categoria === categoria)
                  .map((cmd) => cmd.name)
                  .join(" · ")}
              </span>
            </div>
          ))}
      </div>

      {/* Atalhos do terminal numa linha só: o "ajuda" inteiro tem que caber
          na tela sem rolagem */}
      <p className="ajuda-dicas">
        {t("ajuda.dicas.titulo")} {t("ajuda.dicas.historico")} · {t("ajuda.dicas.autocomplete")}
        {!tudo && ` · ${t("ajuda.dicas.tudo")}`}
      </p>
    </div>
  );
};

export default Ajuda;
