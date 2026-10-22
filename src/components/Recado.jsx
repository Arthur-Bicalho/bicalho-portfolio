import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n/recado";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { obterSupabase, supabaseConfigurado } from "../lib/supabase";
import { RetroBar } from "../hud/RetroLoader";
import "./Cli.css";
import "./BotaoVoltar.css";
import "./Recado.css";

// "recado" (note): um recado anônimo que só o Arthur lê
// (supabase/recados.sql: o visitante só insere, nem lê o próprio recado).
// Mesmos limites do banco aqui, só por conforto: quem garante é o banco.

const MAX = 280;

const chaveDoErro = (error) => {
  if (error?.code === "PT429") {
    return error.hint === "limite_dia" ? "recado.erro_limite_dia" : "recado.erro_limite";
  }
  if (error?.code === "23514") return "recado.erro_tamanho";
  return "recado.erro";
};

const Recado = ({ texto: inicial = "", onExit }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const botao = useRef(null);
  const enviandoRef = useRef(false);
  useCommandAtTop(ref);

  const [texto, setTexto] = useState(inicial.slice(0, MAX));
  const [passo, setPasso] = useState("escrevendo"); // escrevendo | enviando | enviado
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (passo === "enviado") botao.current?.focus();
  }, [passo]);

  async function enviar() {
    if (enviandoRef.current || !texto.trim()) return;
    enviandoRef.current = true;
    setErro(null);
    setPasso("enviando");
    const supabase = await obterSupabase();
    // Sem select: o visitante não tem permissão de ler (return=minimal)
    const { error } = supabase
      ? await supabase.from("recados").insert({ texto: texto.trim() })
      : { error: true };
    enviandoRef.current = false;
    if (error) {
      setErro(chaveDoErro(error));
      setPasso("escrevendo");
      return;
    }
    setPasso("enviado");
  }

  const outro = () => {
    setTexto("");
    setPasso("escrevendo");
  };

  return (
    <div
      className="recado"
      ref={ref}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onExit?.();
        }
      }}
    >
      <p className="recado-titulo">{t("recado.titulo")}</p>
      <p className="recado-intro">{t("recado.intro")}</p>

      {!supabaseConfigurado && <p className="cli-hint">{t("recado.nao_configurado")}</p>}

      {supabaseConfigurado && passo !== "enviado" && (
        <>
          <div className="cli-input-line">
            <span className="cli-prefix" aria-hidden="true">
              &gt;
            </span>
            <input
              className="cli-input recado-input"
              type="text"
              value={texto}
              maxLength={MAX}
              readOnly={passo === "enviando"}
              aria-label={t("recado.campo")}
              aria-describedby="recado-contador"
              autoComplete="off"
              autoFocus
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") enviar();
              }}
            />
          </div>
          <p id="recado-contador" className="cli-hint">
            {t("recado.contador", { n: texto.length, max: MAX })}
            {" · "}
            {passo === "enviando" ? t("recado.enviando") : t("recado.teclado")}
          </p>
          {erro && (
            <p className="recado-erro" role="alert">
              {t(erro)}
            </p>
          )}
        </>
      )}

      {passo === "enviado" && (
        // Confirmação no estilo da janela "System message" (hud/RetroLoader)
        <div className="retro-loader recado-confirmacao" role="status">
          <div className="retro-loader-titulo">
            <span>System message</span>
            <span aria-hidden="true" className="retro-loader-fechar">
              ×
            </span>
          </div>
          <div className="retro-loader-corpo">
            <span aria-hidden="true" className="retro-loader-icone recado-icone">
              ✓
            </span>
            <div className="retro-loader-texto">
              <span className="retro-loader-principal">{t("recado.enviado")}</span>
              <span className="retro-loader-detalhe">{t("recado.enviado_detalhe")}</span>
            </div>
          </div>
          <div className="retro-loader-barra">
            <RetroBar value={100} label={t("recado.enviado")} />
          </div>
        </div>
      )}

      <div className="recado-botoes">
        {passo === "enviado" && (
          <button type="button" className="btn-voltar-terminal" ref={botao} onClick={outro}>
            {t("recado.outro")}
          </button>
        )}
        {onExit && (
          <button type="button" className="btn-voltar-terminal" onClick={onExit}>
            {t("recado.voltar")}
          </button>
        )}
      </div>
    </div>
  );
};

export default Recado;
