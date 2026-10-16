import React, { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaDownload, FaFilePdf, FaUserGraduate } from "react-icons/fa";
import { FiArrowUpRight, FiExternalLink } from "react-icons/fi";
import { lattesInfo, DEFAULT_SECTION, SECTIONS } from "../data/lattesData";
import useCommandAtTop from "../terminal/useCommandAtTop";
import SkinsFooter from "./SkinsFooter";
import "./Lattes.css";

// Comando "lattes": um resumo com o link do Currículo Lattes (lattes) e o
// card de download do PDF (lattes --pdf). Os dados ficam em data/lattesData.js.

// Nome do arquivo baixado: "Curriculo-Lattes-Arthur-Bicalho-Angelo.pdf"
const pdfFileName = () =>
  `Curriculo-Lattes-${lattesInfo.nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-")}.pdf`;

// "http://lattes.cnpq.br/123" → "lattes.cnpq.br/123"
const shortUrl = (url) => url.replace(/^https?:\/\//, "");

function useFormatters() {
  const { i18n } = useTranslation();
  const locale = i18n.language.startsWith("en") ? "en-US" : "pt-BR";
  return useMemo(() => {
    const dateFormat = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const sizeFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
    return {
      date: (iso) => {
        if (!iso) return "";
        const [y, m, d] = iso.split("-").map(Number);
        return dateFormat.format(new Date(y, m - 1, d));
      },
      size: (bytes) => (bytes ? `${sizeFormat.format(bytes / 1024 / 1024)} MB` : ""),
    };
  }, [locale]);
}

function Resumo() {
  const { t } = useTranslation();
  return (
    <div className="lattes-card">
      <FaUserGraduate className="lattes-card-icone" aria-hidden="true" />
      <div>
        <p className="lattes-card-texto">{t("lattes.resumo_texto")}</p>
        {lattesInfo.url && (
          <div className="lattes-pdf-acoes">
            <a className="lattes-botao principal" href={lattesInfo.url} target="_blank" rel="noopener noreferrer">
              <FiArrowUpRight aria-hidden="true" />
              {t("lattes.pdf.lattes")}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function Pdf() {
  const { t } = useTranslation();
  const f = useFormatters();
  const { pdf } = lattesInfo;

  if (!pdf) return <p className="lattes-vazio">{t("lattes.pdf.indisponivel")}</p>;

  const fileName = pdfFileName();
  const meta = [
    pdf.paginas && t("lattes.pdf.paginas", { count: pdf.paginas }),
    f.size(pdf.bytes),
    lattesInfo.atualizadoEm && t("lattes.atualizado", { data: f.date(lattesInfo.atualizadoEm) }),
  ].filter(Boolean);

  return (
    <div className="lattes-pdf">
      <FaFilePdf className="lattes-pdf-icone" aria-hidden="true" />
      <div className="lattes-pdf-info">
        <p className="lattes-pdf-nome">{fileName}</p>
        <p className="lattes-pdf-meta">{meta.join(" · ")}</p>
        <p className="lattes-pdf-desc">{t("lattes.pdf.descricao")}</p>
        <div className="lattes-pdf-acoes">
          <a className="lattes-botao principal" href={pdf.arquivo} download={fileName}>
            <FaDownload aria-hidden="true" />
            {t("lattes.pdf.baixar")}
          </a>
          <a className="lattes-botao" href={pdf.arquivo} target="_blank" rel="noopener noreferrer">
            <FiExternalLink aria-hidden="true" />
            {t("lattes.pdf.abrir")}
          </a>
          {lattesInfo.url && (
            <a className="lattes-botao" href={lattesInfo.url} target="_blank" rel="noopener noreferrer">
              <FiArrowUpRight aria-hidden="true" />
              {t("lattes.pdf.lattes")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Lattes({ section = DEFAULT_SECTION }) {
  const { t } = useTranslation();
  const f = useFormatters();
  const panelRef = useRef(null);

  // Comando no topo, com a saída abaixo (ver terminal/useCommandAtTop.js)
  useCommandAtTop(panelRef);

  return (
    <div className="lattes-painel" ref={panelRef}>
      <h3 className="lattes-titulo">{t("lattes.titulo")}</h3>
      {lattesInfo.url ? (
        <>
          <p className="lattes-subtitulo">
            <a href={lattesInfo.url} target="_blank" rel="noopener noreferrer">
              {shortUrl(lattesInfo.url)}
            </a>
            {lattesInfo.orcid && (
              <>
                {" · "}
                <a href={lattesInfo.orcid} target="_blank" rel="noopener noreferrer">
                  ORCID
                </a>
              </>
            )}
            {lattesInfo.atualizadoEm && (
              <> · {t("lattes.atualizado", { data: f.date(lattesInfo.atualizadoEm) })}</>
            )}
          </p>
          {section === "pdf" ? <Pdf /> : <Resumo />}
        </>
      ) : (
        <p className="lattes-vazio">{t("lattes.em_breve")}</p>
      )}

      <SkinsFooter skins={SECTIONS} active={section} namespace="lattes" />
    </div>
  );
}
