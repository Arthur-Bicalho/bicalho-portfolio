import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n/digitar";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { trechos } from "../data/digitarData";
import "./BotaoVoltar.css";
import "./Digitar.css";

// "digitar" (type): teste de digitação com comandos de Linux e trechos de
// código (data/digitarData.js). PPM, precisão e erros ao vivo; o caractere
// errado fica destacado. Os 5 melhores resultados ficam no localStorage.
//
// PPM (WPM) é o padrão dos testes de digitação: 5 caracteres = 1 palavra.
// A precisão conta todas as teclas digitadas, inclusive as apagadas depois.

const CHAVE_PLACAR = "portfolio:digitarPlacar";
const TOP = 5;

const sortear = (atual) => {
  let i;
  do i = Math.floor(Math.random() * trechos.length);
  while (trechos.length > 1 && i === atual);
  return i;
};

function lerPlacar() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_PLACAR));
    return Array.isArray(salvo) ? salvo.filter((r) => Number.isFinite(r?.ppm)).slice(0, TOP) : [];
  } catch {
    return [];
  }
}

function salvarPlacar(placar) {
  try {
    localStorage.setItem(CHAVE_PLACAR, JSON.stringify(placar));
  } catch {
    // sem storage: o placar vale só nesta aba
  }
}

const Digitar = ({ onExit }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const campo = useRef(null);
  const botao = useRef(null);
  useCommandAtTop(ref);

  const [indice, setIndice] = useState(() => sortear(-1));
  const [digitado, setDigitado] = useState("");
  const [inicio, setInicio] = useState(null);
  const [agora, setAgora] = useState(0);
  const [teclas, setTeclas] = useState({ total: 0, certas: 0 });
  const [fim, setFim] = useState(null); // { ppm, precisao, recorde }
  const [placar, setPlacar] = useState(lerPlacar);

  const alvo = trechos[indice].texto;
  const erros = [...digitado].filter((ch, i) => ch !== alvo[i]).length;
  const decorrido = inicio === null ? 0 : (fim ? fim.ms : agora - inicio);
  const minutos = decorrido / 60000;
  const certosAgora = [...digitado].filter((ch, i) => ch === alvo[i]).length;
  const ppm = minutos > 0 ? Math.round(certosAgora / 5 / minutos) : 0;
  const precisao = teclas.total ? Math.round((teclas.certas / teclas.total) * 100) : 100;

  // Relógio: só enquanto digita
  useEffect(() => {
    if (inicio === null || fim) return undefined;
    const id = setInterval(() => setAgora(performance.now()), 250);
    return () => clearInterval(id);
  }, [inicio, fim]);

  useEffect(() => {
    if (fim) botao.current?.focus({ preventScroll: true });
    else campo.current?.focus({ preventScroll: true });
  }, [fim, indice]);

  const mudar = (e) => {
    if (fim) return;
    const valor = e.target.value.slice(0, alvo.length);
    const t0 = inicio ?? performance.now();
    if (inicio === null) {
      setInicio(t0);
      setAgora(t0);
    }
    // Só as teclas novas contam para a precisão (apagar não conta)
    const novas = valor.length > digitado.length ? valor.slice(digitado.length) : "";
    const certas = [...novas].filter((ch, i) => ch === alvo[digitado.length + i]).length;
    const contagem = { total: teclas.total + novas.length, certas: teclas.certas + certas };
    setTeclas(contagem);
    setDigitado(valor);

    if (valor === alvo) {
      const ms = performance.now() - t0;
      const resultado = {
        ppm: Math.round(alvo.length / 5 / (ms / 60000)),
        precisao: Math.round((contagem.certas / Math.max(contagem.total, 1)) * 100),
      };
      const novo = [...placar, { ...resultado, em: Date.now() }]
        .sort((a, b) => b.ppm - a.ppm)
        .slice(0, TOP);
      const recorde = !placar.length || resultado.ppm > placar[0].ppm;
      setPlacar(novo);
      salvarPlacar(novo);
      setFim({ ...resultado, ms, recorde });
    }
  };

  const recomecar = () => {
    setIndice((i) => sortear(i));
    setDigitado("");
    setInicio(null);
    setAgora(0);
    setTeclas({ total: 0, certas: 0 });
    setFim(null);
  };

  return (
    <div
      className="digitar"
      ref={ref}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onExit?.();
        } else if (e.key === "Enter" && e.target === campo.current) {
          e.preventDefault();
          recomecar();
        }
      }}
    >
      <p className="digitar-titulo">{t("digitar.titulo")}</p>
      <p className="digitar-intro">{t("digitar.intro")}</p>

      {/* O trecho, letra por letra: certa, errada (destacada) ou a digitar */}
      <p className="digitar-alvo" aria-hidden="true">
        <span className="digitar-tipo">{trechos[indice].tipo}$ </span>
        {[...alvo].map((ch, i) => {
          let classe = "digitar-pendente";
          if (i < digitado.length) classe = digitado[i] === ch ? "digitar-certo" : "digitar-errado";
          else if (i === digitado.length && !fim) classe = "digitar-cursor";
          return (
            <span key={i} className={classe}>
              {ch}
            </span>
          );
        })}
      </p>

      <input
        ref={campo}
        className="digitar-input"
        type="text"
        value={digitado}
        readOnly={Boolean(fim)}
        aria-label={`${t("digitar.campo")}: ${alvo}`}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        onChange={mudar}
        onPaste={(e) => e.preventDefault()}
      />

      <dl className="digitar-numeros" aria-live="off">
        <div>
          <dt title={t("digitar.ppm_longo")}>{t("digitar.ppm")}</dt>
          <dd>{fim ? fim.ppm : ppm}</dd>
        </div>
        <div>
          <dt>{t("digitar.precisao")}</dt>
          <dd>{fim ? fim.precisao : precisao}%</dd>
        </div>
        <div>
          <dt>{t("digitar.erros")}</dt>
          <dd className={erros ? "digitar-com-erro" : undefined}>{erros}</dd>
        </div>
        <div>
          <dt>{t("digitar.tempo")}</dt>
          <dd>{(decorrido / 1000).toFixed(1)} s</dd>
        </div>
      </dl>

      {fim ? (
        <div className="digitar-fim" role="status">
          <p className="digitar-resultado">{t("digitar.fim", { ppm: fim.ppm, precisao: fim.precisao })}</p>
          {fim.recorde && <p className="digitar-recorde">{t("digitar.recorde")}</p>}
        </div>
      ) : (
        <p className="digitar-dica">{t("digitar.teclado")}</p>
      )}

      <section aria-labelledby="digitar-placar">
        <h3 id="digitar-placar" className="digitar-rotulo">
          {t("digitar.placar")}
        </h3>
        {placar.length ? (
          <ol className="digitar-placar">
            {placar.map((r, i) => (
              <li key={`${r.em}-${i}`}>
                {r.ppm} {t("digitar.ppm")} · {r.precisao}%
              </li>
            ))}
          </ol>
        ) : (
          <p className="digitar-dica">{t("digitar.placar_vazio")}</p>
        )}
      </section>

      <div className="digitar-botoes">
        {fim && (
          <button type="button" className="btn-voltar-terminal" ref={botao} onClick={recomecar}>
            {t("digitar.outro")}
          </button>
        )}
        {onExit && (
          <button type="button" className="btn-voltar-terminal" onClick={onExit}>
            {t("digitar.voltar")}
          </button>
        )}
      </div>
    </div>
  );
};

export default Digitar;
