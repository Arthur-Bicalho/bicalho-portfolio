import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n/galoGrita";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { RetroBar } from "../hud/RetroLoader";
import "./BotaoVoltar.css";
import "./GaloGrita.css";

// "galo grita" (galo roar): uma fanfarra chiptune ORIGINAL de ~10 s, tocada
// com a Web Audio API (não é o hino do clube). Só toca depois do comando;
// se o navegador bloquear o som (link direto, sem clique), aparece o botão
// "Tocar". O escudo pisca no ritmo e a RetroBar mostra o progresso.

const BPM = 128; // 21,5 batidas → ~10 s
const BATIDA = 60 / BPM; // segundos

// [nota, batidas] da melodia (null = pausa). Notas em Hz pelo nome.
const NOTA = (nome) => {
  const semitons = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 }[nome[0]];
  const oitava = Number(nome.at(-1));
  const acidente = nome.includes("#") ? 1 : 0;
  return 440 * 2 ** ((semitons + acidente + (oitava - 4) * 12) / 12);
};

const MELODIA = [
  ["G4", 0.5], ["G4", 0.5], ["G4", 0.5], ["C5", 1.5], [null, 0.5], ["G4", 0.5], ["C5", 0.5], ["E5", 2],
  ["D5", 0.5], ["C5", 0.5], ["D5", 0.5], ["E5", 0.5], ["G5", 1.5], [null, 0.5],
  ["E5", 0.5], ["G5", 0.5], ["A5", 1], ["G5", 0.5], ["E5", 0.5], ["C5", 1], ["D5", 1],
  ["G4", 0.5], ["A4", 0.5], ["B4", 0.5], ["C5", 0.5], ["E5", 0.5], ["G5", 0.5], ["C6", 3],
];

const BAIXO = [
  ["C3", 2], ["C3", 2], ["G2", 2], ["C3", 2],
  ["F2", 2], ["G2", 2], ["A2", 2], ["G2", 2],
  ["C3", 1], ["G2", 1], ["C3", 3],
];

const duracao = (seq) => seq.reduce((s, [, b]) => s + b, 0) * BATIDA;
const TOTAL = Math.max(duracao(MELODIA), duracao(BAIXO));

// Agenda uma sequência num oscilador por nota, com ataque e soltura curtos
function agendar(ctx, destino, seq, tipo, volume, t0) {
  let t = t0;
  for (const [nome, batidas] of seq) {
    const dur = batidas * BATIDA;
    if (nome) {
      const osc = ctx.createOscillator();
      const ganho = ctx.createGain();
      osc.type = tipo;
      osc.frequency.value = NOTA(nome);
      ganho.gain.setValueAtTime(0, t);
      ganho.gain.linearRampToValueAtTime(volume, t + 0.01);
      ganho.gain.setValueAtTime(volume, t + dur * 0.8);
      ganho.gain.linearRampToValueAtTime(0, t + dur * 0.95);
      osc.connect(ganho).connect(destino);
      osc.start(t);
      osc.stop(t + dur);
    }
    t += dur;
  }
}

const GaloGrita = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  useCommandAtTop(ref);
  const ctxRef = useRef(null);
  const [estado, setEstado] = useState("iniciando"); // iniciando | tocando | bloqueado | fim | parado | sem_audio
  const [progresso, setProgresso] = useState(0);

  const parar = useCallback((proximo = "parado") => {
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    setEstado(proximo);
  }, []);

  const tocar = useCallback(async () => {
    const Contexto = window.AudioContext || window.webkitAudioContext;
    if (!Contexto) {
      setEstado("sem_audio");
      return;
    }
    ctxRef.current?.close().catch(() => {});
    const ctx = new Contexto();
    ctxRef.current = ctx;
    await ctx.resume().catch(() => {});
    if (ctx.state !== "running") {
      // Sem um clique antes (ex.: link direto), o navegador segura o som
      ctx.close().catch(() => {});
      ctxRef.current = null;
      setEstado("bloqueado");
      return;
    }
    const mestre = ctx.createGain();
    mestre.gain.value = 0.18;
    mestre.connect(ctx.destination);
    const t0 = ctx.currentTime + 0.05;
    agendar(ctx, mestre, MELODIA, "square", 0.5, t0);
    agendar(ctx, mestre, BAIXO, "triangle", 0.7, t0);
    setProgresso(0);
    setEstado("tocando");
  }, []);

  // Toca ao abrir; para ao sair da tela (o comando foi limpo, por exemplo)
  useEffect(() => {
    tocar();
    return () => {
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, [tocar]);

  // Progresso pela hora do próprio áudio
  useEffect(() => {
    if (estado !== "tocando") return undefined;
    const id = setInterval(() => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      const pct = Math.min(100, ((ctx.currentTime - 0.05) / TOTAL) * 100);
      setProgresso(pct);
      if (pct >= 100) parar("fim");
    }, 100);
    return () => clearInterval(id);
  }, [estado, parar]);

  const tocando = estado === "tocando";
  const mensagem = {
    iniciando: t("galogrita.tocando"),
    tocando: t("galogrita.tocando"),
    bloqueado: t("galogrita.bloqueado"),
    fim: t("galogrita.terminou"),
    parado: t("galogrita.parado"),
    sem_audio: t("galogrita.sem_audio"),
  }[estado];

  return (
    <div className="galogrita" ref={ref}>
      <p className="galogrita-titulo">{t("galogrita.titulo")}</p>
      <div className="galogrita-palco">
        <img
          className={tocando ? "galogrita-escudo galogrita-piscando" : "galogrita-escudo"}
          style={{ "--batida": `${BATIDA}s` }}
          src="/galo/escudo-cam.webp"
          alt={t("galogrita.escudo_alt")}
          width="96"
          height="96"
        />
        <div className="galogrita-painel">
          <p className="galogrita-mensagem" role="status">
            {mensagem}
          </p>
          <RetroBar value={Math.round(progresso)} label={t("galogrita.progresso")} />
          <div className="galogrita-botoes">
            {tocando && (
              <button type="button" className="btn-voltar-terminal" onClick={() => parar()}>
                {t("galogrita.parar")}
              </button>
            )}
            {estado === "bloqueado" && (
              <button type="button" className="btn-voltar-terminal" onClick={tocar}>
                {t("galogrita.tocar")}
              </button>
            )}
            {(estado === "fim" || estado === "parado") && (
              <button type="button" className="btn-voltar-terminal" onClick={tocar}>
                {t("galogrita.de_novo")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaloGrita;
