import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n/indicar";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { obterSupabase, supabaseConfigurado } from "../lib/supabase";
import { RetroBar } from "../hud/RetroLoader";
import "./Cli.css";
import "./BotaoVoltar.css";
import "./Indicar.css";

// "indicar" (recommend): indicações de música que só aparecem depois de
// aprovadas (supabase/indicacoes.sql: o visitante lê só as aprovadas e o
// insert sempre grava pendente).
//
//   indicar            a lista das aprovadas
//   indicar --enviar   artista → música (opcional) → nome (opcional) → envia

const LIMITES = { artista: 60, musica: 80, nome: 30 };
const PASSOS = ["artista", "musica", "nome"];
const TOP = 20;

const chaveDoErro = (error) => {
  if (error?.code === "PT429") {
    return error.hint === "limite_dia" ? "indicar.erro_limite_dia" : "indicar.erro_limite";
  }
  if (error?.code === "23514") return "indicar.erro_tamanho";
  return "indicar.erro";
};

function Lista() {
  const { t } = useTranslation();
  const [estado, setEstado] = useState("carregando");
  const [itens, setItens] = useState([]);

  useEffect(() => {
    let vivo = true;
    obterSupabase()
      .then((supabase) =>
        supabase
          ? supabase
              .from("indicacoes")
              .select("id, artista, musica, nome")
              .order("created_at", { ascending: false })
              .limit(TOP)
          : { error: true },
      )
      .then(({ data, error }) => {
        if (!vivo) return;
        if (error) {
          setEstado("erro");
          return;
        }
        setItens(data ?? []);
        setEstado("pronto");
      });
    return () => {
      vivo = false;
    };
  }, []);

  if (estado === "carregando") {
    return (
      <p className="cli-hint" role="status">
        {t("indicar.carregando")}
      </p>
    );
  }
  if (estado === "erro") return <p className="cli-hint">{t("indicar.erro_lista")}</p>;
  if (itens.length === 0) return <p className="cli-hint">{t("indicar.vazio")}</p>;
  return (
    <ul className="indicar-lista" aria-label={t("indicar.lista")}>
      {itens.map((item) => (
        <li key={item.id}>
          <span className="indicar-artista">{item.artista}</span>
          {item.musica && <span className="indicar-musica"> · {item.musica}</span>}
          {item.nome && <span className="indicar-por"> · {t("indicar.por", { nome: item.nome })}</span>}
        </li>
      ))}
    </ul>
  );
}

function Envio({ onExit }) {
  const { t } = useTranslation();
  const [valores, setValores] = useState({ artista: "", musica: "", nome: "" });
  const [passo, setPasso] = useState("artista"); // artista | musica | nome | enviando | enviado
  const [erro, setErro] = useState(null);
  const enviandoRef = useRef(false);
  const botao = useRef(null);

  useEffect(() => {
    if (passo === "enviado" || (erro && passo === "erro")) botao.current?.focus();
  }, [passo, erro]);

  async function enviar() {
    if (enviandoRef.current) return;
    enviandoRef.current = true;
    setPasso("enviando");
    const supabase = await obterSupabase();
    // Pendente sempre: o banco força aprovado = false de qualquer jeito
    const { error } = supabase
      ? await supabase.from("indicacoes").insert({
          artista: valores.artista.trim(),
          musica: valores.musica.trim() || null,
          nome: valores.nome.trim() || null,
        })
      : { error: true };
    enviandoRef.current = false;
    if (error) {
      setErro(chaveDoErro(error));
      setPasso("erro");
      return;
    }
    setPasso("enviado");
  }

  const avancar = (campo) => {
    if (campo === "artista" && !valores.artista.trim()) return;
    const proximo = PASSOS[PASSOS.indexOf(campo) + 1];
    if (proximo) setPasso(proximo);
    else enviar();
  };

  const recomecar = () => {
    setValores({ artista: "", musica: "", nome: "" });
    setErro(null);
    setPasso("artista");
  };

  if (!supabaseConfigurado) return <p className="cli-hint">{t("indicar.nao_configurado")}</p>;

  return (
    <div className="indicar-envio">
      {/* Os campos já respondidos ficam visíveis, como num terminal */}
      {PASSOS.slice(0, PASSOS.includes(passo) ? PASSOS.indexOf(passo) : PASSOS.length).map((campo) => (
        <p key={campo} className="indicar-resposta">
          <span className="cli-hint">{t(`indicar.${campo}`)}:</span>{" "}
          <span className="indicar-valor">{valores[campo].trim() || "—"}</span>
        </p>
      ))}

      {PASSOS.includes(passo) && (
        <>
          <label className="cli-hint" htmlFor={`indicar-${passo}`}>
            {t(`indicar.${passo}`)}:
          </label>
          <div className="cli-input-line">
            <span className="cli-prefix" aria-hidden="true">
              &gt;
            </span>
            <input
              key={passo}
              id={`indicar-${passo}`}
              className="cli-input indicar-input"
              type="text"
              value={valores[passo]}
              maxLength={LIMITES[passo]}
              autoComplete="off"
              autoFocus
              onChange={(e) => setValores((v) => ({ ...v, [passo]: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === "Enter") avancar(passo);
              }}
            />
          </div>
          <p className="cli-hint">
            {valores[passo].length}/{LIMITES[passo]} · {t("indicar.teclado")}
          </p>
        </>
      )}

      {passo === "enviando" && (
        <p className="cli-hint" role="status">
          {t("indicar.enviando")}
        </p>
      )}

      {passo === "erro" && (
        <p className="indicar-erro" role="alert">
          {t(erro)}
        </p>
      )}

      {passo === "enviado" && (
        // Confirmação no estilo da janela "System message" (hud/RetroLoader)
        <div className="retro-loader indicar-confirmacao" role="status">
          <div className="retro-loader-titulo">
            <span>System message</span>
            <span aria-hidden="true" className="retro-loader-fechar">
              ×
            </span>
          </div>
          <div className="retro-loader-corpo">
            <span aria-hidden="true" className="retro-loader-icone indicar-icone">
              ✓
            </span>
            <div className="retro-loader-texto">
              <span className="retro-loader-principal">{t("indicar.enviado")}</span>
              <span className="retro-loader-detalhe">{t("indicar.enviado_detalhe")}</span>
            </div>
          </div>
          <div className="retro-loader-barra">
            <RetroBar value={100} label={t("indicar.enviado")} />
          </div>
        </div>
      )}

      <div className="indicar-botoes">
        {(passo === "enviado" || passo === "erro") && (
          <button type="button" className="btn-voltar-terminal" ref={botao} onClick={recomecar}>
            {passo === "enviado" ? t("indicar.outra") : t("indicar.tentar")}
          </button>
        )}
        {onExit && (
          <button type="button" className="btn-voltar-terminal" onClick={onExit}>
            {t("indicar.voltar")}
          </button>
        )}
      </div>
    </div>
  );
}

const Indicar = ({ modo = "lista", onExit }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  useCommandAtTop(ref);
  const enviar = modo === "enviar";

  return (
    <div
      className="indicar"
      ref={ref}
      onKeyDown={(e) => {
        if (enviar && e.key === "Escape") {
          e.preventDefault();
          onExit?.();
        }
      }}
    >
      <p className="indicar-titulo">{t("indicar.titulo")}</p>
      {enviar ? (
        <Envio onExit={onExit} />
      ) : (
        <>
          <p className="indicar-intro">{t("indicar.intro")}</p>
          {supabaseConfigurado ? <Lista /> : <p className="cli-hint">{t("indicar.nao_configurado")}</p>}
          <p className="indicar-como">{t("indicar.como")}</p>
        </>
      )}
    </div>
  );
};

export default Indicar;
