import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n/compartilhar";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { linkDoComando, copiarTexto } from "../lib/compartilhar";
import { RetroBar } from "../hud/RetroLoader";
import "./BotaoVoltar.css";
import "./Compartilhar.css";

// "compartilhar [comando]" (share): monta o link ?cmd=...&lang=... e, no
// celular, abre a folha de compartilhar (Web Share API); no resto, copia
// para a área de transferência. Se o navegador não deixar (ex.: link direto,
// sem clique), mostra o link e um botão para copiar.

const noCelular = () =>
  typeof navigator.share === "function" && window.matchMedia?.("(pointer: coarse)").matches;

const Compartilhar = ({ comando = "" }) => {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  useCommandAtTop(ref);
  const link = linkDoComando(comando, i18n.language);
  const [estado, setEstado] = useState("tentando"); // tentando | copiado | compartilhado | pronto

  useEffect(() => {
    let vivo = true;
    (async () => {
      if (noCelular()) {
        try {
          await navigator.share({ url: link, title: "Arthur Bicalho Angelo" });
          if (vivo) setEstado("compartilhado");
          return;
        } catch {
          // cancelado ou sem permissão: tenta copiar
        }
      }
      const ok = await copiarTexto(link);
      if (vivo) setEstado(ok ? "copiado" : "pronto");
    })();
    return () => {
      vivo = false;
    };
  }, [link]);

  const copiar = async () => setEstado((await copiarTexto(link)) ? "copiado" : "pronto");

  const titulo = { copiado: "copiado", compartilhado: "compartilhado" }[estado] ?? "pronto";
  const detalhe = estado === "pronto" ? "pronto_detalhe" : "copiado_detalhe";

  return (
    <div className="compartilhar" ref={ref}>
      {estado !== "tentando" && (
        <div className="retro-loader compartilhar-janela" role="status">
          <div className="retro-loader-titulo">
            <span>System message</span>
            <span aria-hidden="true" className="retro-loader-fechar">
              ×
            </span>
          </div>
          <div className="retro-loader-corpo">
            <span
              aria-hidden="true"
              className={
                estado === "pronto" ? "retro-loader-icone" : "retro-loader-icone compartilhar-ok"
              }
            >
              {estado === "pronto" ? "!" : "✓"}
            </span>
            <div className="retro-loader-texto">
              <span className="retro-loader-principal">{t(`compartilhar.${titulo}`)}</span>
              <span className="retro-loader-detalhe">{t(`compartilhar.${detalhe}`)}</span>
            </div>
          </div>
          <div className="retro-loader-barra">
            <RetroBar value={estado === "pronto" ? 0 : 100} label={t(`compartilhar.${titulo}`)} />
          </div>
        </div>
      )}
      <p className="compartilhar-link">
        <span className="compartilhar-rotulo">{t("compartilhar.link")}:</span> <a href={link}>{link}</a>
      </p>
      {estado === "pronto" && (
        <button type="button" className="btn-voltar-terminal" onClick={copiar}>
          {t("compartilhar.copiar")}
        </button>
      )}
    </div>
  );
};

export default Compartilhar;
