import React, { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n/cifra";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { cesar, rot13, vigenere, paraBase64, deBase64, paraHex, deHex, sha256 } from "../lib/cifras";
import "./Cli.css";
import "./BotaoVoltar.css";
import "./Cifra.css";

// "cifra <texto>": o texto passa ao vivo por cada cifra/codificação, com uma
// explicação curta de cada uma. "--decodificar" faz o caminho de volta (útil
// para as pistas do "ctf"). Tudo no navegador, sem rede.

const MAX_TEXTO = 500;
const CHAVE_PADRAO = "bicalho";

const Cifra = ({ texto: inicial = "", decodificar: decodificarInicial = false, onExit }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const campo = useRef(null);
  const id = useId();
  useCommandAtTop(ref);

  const [texto, setTexto] = useState(inicial.slice(0, MAX_TEXTO));
  const [decodificar, setDecodificar] = useState(decodificarInicial);
  const [n, setN] = useState(3);
  const [chave, setChave] = useState(CHAVE_PADRAO);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const el = campo.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    el.setSelectionRange(el.value.length, el.value.length);
  }, []);

  // SHA-256 é assíncrono (crypto.subtle); o "vivo" descarta respostas velhas
  useEffect(() => {
    if (decodificar || !texto) return undefined;
    let vivo = true;
    sha256(texto).then((h) => vivo && setHash(h ?? null));
    return () => {
      vivo = false;
    };
  }, [texto, decodificar]);

  const tentar = (fn, formato) => {
    try {
      return { valor: fn() };
    } catch {
      return { erro: t("cifra.invalido", { formato }) };
    }
  };

  const linhas = [
    {
      id: "cesar",
      nome: `César (+${n})`,
      valor: cesar(texto, decodificar ? -n : n),
      explicacao: t("cifra.cesar", { n }),
    },
    { id: "rot13", nome: "ROT13", valor: rot13(texto), explicacao: t("cifra.rot13") },
    {
      id: "vigenere",
      nome: `Vigenère (${chave || "—"})`,
      valor: vigenere(texto, chave, decodificar ? -1 : 1),
      explicacao: t("cifra.vigenere"),
    },
    {
      id: "base64",
      nome: "Base64",
      ...(decodificar ? tentar(() => deBase64(texto), "Base64") : { valor: paraBase64(texto) }),
      explicacao: t("cifra.base64"),
    },
    {
      id: "hex",
      nome: "Hex",
      ...(decodificar ? tentar(() => deHex(texto), "hex") : { valor: paraHex(texto) }),
      explicacao: t("cifra.hex"),
    },
    {
      id: "sha256",
      nome: "SHA-256",
      ...(decodificar
        ? { erro: t("cifra.sem_volta") }
        : hash === null
          ? { erro: t("cifra.sem_crypto") }
          : { valor: hash }),
      explicacao: t("cifra.sha256"),
    },
  ];

  return (
    <div
      className="cifra"
      ref={ref}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onExit?.();
        }
      }}
    >
      <p className="cifra-titulo">{t("cifra.titulo")}</p>
      <p className="cifra-intro">{t("cifra.intro")}</p>

      <div className="cifra-controles">
        <div className="cli-input-line cifra-campo">
          <span className="cli-prefix" aria-hidden="true">
            &gt;
          </span>
          <input
            ref={campo}
            className="cli-input cifra-input"
            type="text"
            value={texto}
            maxLength={MAX_TEXTO}
            spellCheck="false"
            autoComplete="off"
            autoCapitalize="off"
            aria-label={decodificar ? t("cifra.campo_decodificar") : t("cifra.campo")}
            onChange={(e) => setTexto(e.target.value)}
          />
        </div>

        <div className="cifra-opcoes">
          <fieldset className="cifra-modo">
            <legend className="cifra-rotulo">{t("cifra.modo")}</legend>
            {[false, true].map((valor) => (
              <label key={String(valor)} className="cifra-radio">
                <input
                  type="radio"
                  name={`${id}-modo`}
                  checked={decodificar === valor}
                  onChange={() => setDecodificar(valor)}
                />
                {valor ? t("cifra.decodificar") : t("cifra.codificar")}
              </label>
            ))}
          </fieldset>

          <label className="cifra-opcao">
            <span className="cifra-rotulo">{t("cifra.deslocamento")}</span>
            <input
              className="cifra-numero"
              type="number"
              min="1"
              max="25"
              value={n}
              onChange={(e) => {
                const valor = Math.round(Number(e.target.value));
                if (valor >= 1 && valor <= 25) setN(valor);
              }}
            />
          </label>

          <label className="cifra-opcao">
            <span className="cifra-rotulo">{t("cifra.chave")}</span>
            <input
              className="cifra-chave"
              type="text"
              value={chave}
              maxLength={30}
              spellCheck="false"
              autoComplete="off"
              autoCapitalize="off"
              onChange={(e) => setChave(e.target.value)}
            />
          </label>
        </div>
      </div>

      <dl className="cifra-lista" aria-live="off">
        {linhas.map((linha) => (
          <div key={linha.id} className="cifra-item">
            <dt className="cifra-nome">{linha.nome}</dt>
            <dd className="cifra-valor">
              {!texto ? (
                <span className="cifra-dim">{t("cifra.vazio")}</span>
              ) : linha.erro ? (
                <span className="cifra-dim">{linha.erro}</span>
              ) : (
                <output>{linha.valor}</output>
              )}
            </dd>
            <dd className="cifra-explicacao">{linha.explicacao}</dd>
          </div>
        ))}
      </dl>

      <p className="cifra-dica">{t("cifra.teclado")}</p>
      {onExit && (
        <button type="button" className="btn-voltar-terminal" onClick={onExit}>
          {t("cifra.voltar")}
        </button>
      )}
    </div>
  );
};

export default Cifra;
