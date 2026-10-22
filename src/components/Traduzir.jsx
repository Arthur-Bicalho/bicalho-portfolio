import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n/traduzir";
import useCommandAtTop from "../terminal/useCommandAtTop";
import "./Cli.css";
import "./Traduzir.css";

// "traduzir <texto>" (translate): o texto em português, inglês, alemão e
// espanhol, pela IA do servidor (api/_traduzir.js). A chave nunca vem para o
// navegador; o servidor confere o tamanho, a origem, o limite por IP e o
// formato da resposta.

const PROXY_PATH = "/api/traduzir";
const MAX_TEXTO = 100; // o mesmo do servidor
const IDIOMAS = ["pt", "en", "de", "es"];

async function pedirTraducao(texto, sinal) {
  const resposta = await fetch(PROXY_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto }),
    signal: sinal,
  });
  // Sem o cabeçalho, a rota não existe (ex.: Docker sem as funções)
  if (!resposta.headers.get("X-Traduzir-Proxy")) return { erro: "sem_chave" };
  const corpo = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    return { erro: corpo.erro ?? "falha", espera: Number(resposta.headers.get("Retry-After")) || 60 };
  }
  return corpo;
}

const Traduzir = ({ texto }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  useCommandAtTop(ref);
  const longo = texto.length > MAX_TEXTO;
  const [estado, setEstado] = useState(longo ? { erro: "texto_longo" } : null);

  useEffect(() => {
    if (longo) return undefined;
    const controle = new AbortController();
    pedirTraducao(texto, controle.signal)
      .then(setEstado)
      .catch((error) => {
        if (error?.name !== "AbortError") setEstado({ erro: "falha" });
      });
    return () => controle.abort();
  }, [texto, longo]);

  const mensagemDeErro = (erro) => {
    if (erro === "texto_longo") return t("traduzir.erro_longo", { max: MAX_TEXTO });
    if (erro === "limite") return t("traduzir.erro_limite", { segundos: estado.espera });
    if (erro === "limite_ia") return t("traduzir.erro_limite_ia");
    if (erro === "sem_chave") return t("traduzir.erro_config");
    return t("traduzir.erro");
  };

  return (
    <div className="traduzir" ref={ref}>
      <p className="traduzir-titulo">{t("traduzir.titulo")}</p>
      <p className="traduzir-original">“{texto}”</p>

      {!estado && (
        <p className="cli-hint" role="status">
          {t("traduzir.traduzindo")}
        </p>
      )}

      {estado?.erro && (
        <p className="traduzir-erro" role="alert">
          {mensagemDeErro(estado.erro)}
        </p>
      )}

      {estado?.traducoes && (
        <>
          <dl className="traduzir-lista" aria-label={t("traduzir.lista")}>
            {IDIOMAS.map((idioma) => (
              <div key={idioma} className="traduzir-item">
                <dt>
                  <span className="traduzir-sigla">{idioma.toUpperCase()}</span>{" "}
                  <span className="traduzir-idioma">{t(`traduzir.idiomas.${idioma}`)}</span>
                </dt>
                <dd lang={idioma}>{estado.traducoes[idioma]}</dd>
              </div>
            ))}
          </dl>
          <p className="traduzir-nota">{t("traduzir.nota")}</p>
        </>
      )}
    </div>
  );
};

export default Traduzir;
