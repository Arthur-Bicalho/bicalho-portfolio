import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n/ctf";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { obterSupabase, supabaseConfigurado } from "../lib/supabase";
import "./Cli.css";
import "./BotaoVoltar.css";
import "./Ctf.css";

// "ctf": a flag está espalhada pelo site em 3 pedaços codificados (index.html,
// console e robots.txt + cabeçalho HTTP). O site não sabe qual é a flag: quem
// confere é o banco (supabase/ctf.sql), que só guarda o SHA-256 dela.
//
//   ctf               explica, dá as pistas e mostra o placar
//   ctf --placar      só o placar
//   ctf --enviar      abre o envio (flag, depois o nome)
//   ctf bicalho{...}  abre o envio com a flag já preenchida

const MAX_FLAG = 100;
const MAX_NOME = 30;
const TOP = 10;

// Erro do Supabase → texto traduzido (códigos do ctf_enviar)
const chaveDoErro = (error) => {
  if (error?.code === "PT429") {
    if (error.hint === "limite_dia") return "ctf.erro_limite_dia";
    if (error.hint === "limite_placar") return "ctf.erro_limite_placar";
    return "ctf.erro_limite";
  }
  if (error?.code === "22023") return "ctf.erro_tamanho";
  return "ctf.erro";
};

function Placar() {
  const { t, i18n } = useTranslation();
  const [estado, setEstado] = useState(supabaseConfigurado ? "carregando" : "sem_banco");
  const [nomes, setNomes] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!supabaseConfigurado) return undefined;
    let vivo = true;
    obterSupabase()
      .then((supabase) =>
        supabase
          ? supabase
              .from("ctf_placar")
              .select("nome, created_at", { count: "exact" })
              .order("id", { ascending: true })
              .limit(TOP)
          : { error: true },
      )
      .then(({ data, count, error }) => {
        if (!vivo) return;
        if (error) {
          setEstado("erro");
          return;
        }
        setNomes(data ?? []);
        setTotal(count ?? data?.length ?? 0);
        setEstado("pronto");
      });
    return () => {
      vivo = false;
    };
  }, []);

  const locale = i18n.language.startsWith("en") ? "en-US" : "pt-BR";
  return (
    <section className="ctf-secao" aria-labelledby="ctf-placar-titulo">
      <h3 id="ctf-placar-titulo" className="ctf-rotulo">
        {t("ctf.placar_titulo")}
      </h3>
      {estado === "sem_banco" && <p className="cli-hint">{t("ctf.nao_configurado")}</p>}
      {estado === "carregando" && <p className="cli-hint">{t("ctf.carregando")}</p>}
      {estado === "erro" && <p className="cli-hint">{t("ctf.erro_placar")}</p>}
      {estado === "pronto" && total === 0 && <p className="cli-hint">{t("ctf.placar_vazio")}</p>}
      {estado === "pronto" && total > 0 && (
        <>
          <ol className="ctf-placar">
            {nomes.map((linha, i) => (
              <li key={`${i}-${linha.nome}`}>
                <span className="ctf-posicao">{String(i + 1).padStart(2, "0")}</span>
                <span className="ctf-nome">{linha.nome}</span>
                <span className="ctf-data">
                  {new Date(linha.created_at).toLocaleDateString(locale)}
                </span>
              </li>
            ))}
          </ol>
          <p className="cli-hint">{t("ctf.placar_total", { count: total })}</p>
        </>
      )}
    </section>
  );
}

function Envio({ flagInicial, onExit }) {
  const { t } = useTranslation();
  const [flag, setFlag] = useState(flagInicial.slice(0, MAX_FLAG));
  const [nome, setNome] = useState("");
  const [passo, setPasso] = useState(flagInicial ? "nome" : "flag");
  const [resultado, setResultado] = useState(null); // { chave, posicao, ok }
  const enviando = useRef(false);
  const botao = useRef(null);

  useEffect(() => {
    if (passo === "fim") botao.current?.focus();
  }, [passo]);

  async function enviar() {
    if (enviando.current) return;
    enviando.current = true;
    setPasso("enviando");
    const supabase = await obterSupabase();
    const { data, error } = supabase
      ? await supabase.rpc("ctf_enviar", { flag: flag.trim(), nome: nome.trim() })
      : { error: true };
    enviando.current = false;
    if (error) {
      setResultado({ chave: chaveDoErro(error), ok: false });
    } else if (data?.ok) {
      setResultado({ chave: data.repetido ? "ctf.repetida" : "ctf.certa", posicao: data.posicao, ok: true });
    } else {
      setResultado({ chave: "ctf.errada", ok: false });
    }
    setPasso("fim");
  }

  const tentarDeNovo = () => {
    setResultado(null);
    setPasso("flag");
  };

  if (!supabaseConfigurado) return <p className="cli-hint">{t("ctf.nao_configurado")}</p>;

  return (
    <div className="ctf-envio">
      {passo === "flag" && (
        <>
          <label className="cli-hint" htmlFor="ctf-flag">
            {t("ctf.flag_label")}:
          </label>
          <div className="cli-input-line">
            <span className="cli-prefix" aria-hidden="true">
              &gt;
            </span>
            <input
              id="ctf-flag"
              className="cli-input ctf-input"
              type="text"
              value={flag}
              maxLength={MAX_FLAG}
              placeholder="bicalho{...}"
              spellCheck="false"
              autoComplete="off"
              autoCapitalize="off"
              autoFocus
              onChange={(e) => setFlag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && flag.trim()) setPasso("nome");
              }}
            />
          </div>
        </>
      )}

      {passo === "nome" && (
        <>
          <label className="cli-hint" htmlFor="ctf-nome">
            {t("ctf.nome_label")}:
          </label>
          <div className="cli-input-line">
            <span className="cli-prefix" aria-hidden="true">
              &gt;
            </span>
            <input
              id="ctf-nome"
              className="cli-input ctf-input"
              type="text"
              value={nome}
              maxLength={MAX_NOME}
              autoComplete="nickname"
              autoFocus
              onChange={(e) => setNome(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && nome.trim()) enviar();
              }}
            />
          </div>
        </>
      )}

      {passo === "enviando" && (
        <p className="cli-hint" role="status">
          {t("ctf.enviando")}
        </p>
      )}

      {passo === "fim" && resultado && (
        <p className={resultado.ok ? "cli-success ctf-resultado" : "ctf-resultado ctf-erro"} role="alert">
          {t(resultado.chave, { posicao: resultado.posicao })}
        </p>
      )}

      {(passo === "flag" || passo === "nome") && <p className="cli-hint">{t("ctf.teclado")}</p>}

      <div className="ctf-botoes">
        {passo === "fim" && !resultado?.ok && (
          <button type="button" className="btn-voltar-terminal" ref={botao} onClick={tentarDeNovo}>
            {t("ctf.tentar_de_novo")}
          </button>
        )}
        <button
          type="button"
          className="btn-voltar-terminal"
          ref={passo === "fim" && resultado?.ok ? botao : undefined}
          onClick={onExit}
        >
          {t("ctf.voltar")}
        </button>
      </div>
    </div>
  );
}

const Ctf = ({ modo = "inicio", flag = "", onExit }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  useCommandAtTop(ref);

  return (
    <div
      className="ctf"
      ref={ref}
      onKeyDown={(e) => {
        if (modo === "enviar" && e.key === "Escape") {
          e.preventDefault();
          onExit?.();
        }
      }}
    >
      <p className="ctf-titulo">{t("ctf.titulo")}</p>

      {modo === "inicio" && (
        <>
          <p className="ctf-intro">{t("ctf.intro")}</p>
          <section className="ctf-secao" aria-labelledby="ctf-pistas-titulo">
            <h3 id="ctf-pistas-titulo" className="ctf-rotulo">
              {t("ctf.pistas_titulo")}
            </h3>
            <ul className="ctf-pistas">
              {["p1", "p2", "p3", "p4"].map((p) => (
                <li key={p}>{t(`ctf.pistas.${p}`)}</li>
              ))}
            </ul>
          </section>
          <p className="ctf-como">{t("ctf.como_enviar")}</p>
        </>
      )}

      {modo === "enviar" ? <Envio flagInicial={flag} onExit={onExit} /> : <Placar />}
    </div>
  );
};

export default Ctf;
