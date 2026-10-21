import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n/hack";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { RetroBar } from "../hud/RetroLoader";
import { avisarHud } from "../hud/eventos";
import "./BotaoVoltar.css";
import "./Hack.css";

// Minigame "hack": o breach protocol do Cyberpunk 2077 numa grade 5×5.
// A primeira escolha é na linha de cima; depois a vez alterna entre a coluna
// e a linha do último código escolhido. Cada código vai para o buffer, e uma
// sequência é instalada quando aparece inteira, em ordem, no buffer.
//
// A grade é sorteada a partir de um caminho válido, então sempre dá para
// vencer: as sequências são pedaços seguidos desse caminho. O buffer tem uma
// casa a mais que o caminho, para um erro no começo.

const LADO = 5;
const CODIGOS = ["1C", "BD", "55", "E9", "7A", "FF"];
const NOMES = ["DATAMINE_V1", "ICEPICK", "DATAMINE_V3"];

// Tamanho de cada sequência (a soma é o tamanho do caminho) e tempo por nível
const NIVEIS = {
  facil: { sequencias: [3], segundos: 40 },
  normal: { sequencias: [2, 3], segundos: 40 },
  dificil: { sequencias: [2, 3, 3], segundos: 35 },
};

const CHAVE_RECORDE = "portfolio:hackRecorde";

const sortear = (lista) => lista[Math.floor(Math.random() * lista.length)];

// Caminho alternando linha/coluna, começando na linha 0, sem repetir casa
function sortearCaminho(tamanho) {
  for (;;) {
    const usadas = new Set();
    const caminho = [];
    let linha = 0;
    let coluna = null;
    for (let i = 0; i < tamanho; i++) {
      const opcoes = [];
      for (let k = 0; k < LADO; k++) {
        const [l, c] = coluna === null ? [linha, k] : [k, coluna];
        if (!usadas.has(`${l},${c}`)) opcoes.push([l, c]);
      }
      if (opcoes.length === 0) break;
      const [l, c] = sortear(opcoes);
      usadas.add(`${l},${c}`);
      caminho.push([l, c]);
      // Escolheu na linha: a próxima é na coluna, e vice-versa
      if (coluna === null) {
        coluna = c;
      } else {
        linha = l;
        coluna = null;
      }
    }
    if (caminho.length === tamanho) return caminho;
  }
}

function novaPartida(nivel) {
  const tamanhos = NIVEIS[nivel].sequencias;
  const total = tamanhos.reduce((a, b) => a + b, 0);
  const grade = Array.from({ length: LADO }, () =>
    Array.from({ length: LADO }, () => sortear(CODIGOS)),
  );
  const caminho = sortearCaminho(total);
  let inicio = 0;
  const sequencias = tamanhos.map((tamanho, i) => {
    const codigos = caminho.slice(inicio, inicio + tamanho).map(([l, c]) => grade[l][c]);
    inicio += tamanho;
    return { nome: NOMES[i], codigos };
  });
  return { grade, sequencias, tamanhoBuffer: total + 1 };
}

// Sequência dentro do buffer, em ordem e sem buracos
const contem = (buffer, seq) => {
  for (let i = 0; i + seq.length <= buffer.length; i++) {
    if (seq.every((codigo, j) => buffer[i + j] === codigo)) return true;
  }
  return false;
};

function lerRecordes() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_RECORDE)) ?? {};
  } catch {
    return {};
  }
}

function salvarRecorde(nivel, ms) {
  try {
    localStorage.setItem(CHAVE_RECORDE, JSON.stringify({ ...lerRecordes(), [nivel]: ms }));
  } catch {
    // sem storage: o recorde vale só nesta partida
  }
}

const segundos = (ms) => (ms / 1000).toFixed(1);

const Hack = ({ nivel = "normal", onExit }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  useCommandAtTop(ref);
  const config = NIVEIS[nivel];
  const limiteMs = config.segundos * 1000;

  const [partida, setPartida] = useState(() => novaPartida(nivel));
  const [usadas, setUsadas] = useState([]); // [[linha, coluna], ...]
  const [foco, setFoco] = useState([0, 0]);
  const [inicio, setInicio] = useState(null); // relógio começa no 1º código
  const [agora, setAgora] = useState(0);
  const [fim, setFim] = useState(null); // { venceu, motivo, ms, recorde }
  const [aviso, setAviso] = useState("");
  const celulas = useRef({});
  const botaoDeNovo = useRef(null);

  const buffer = usadas.map(([l, c]) => partida.grade[l][c]);
  const vezDaLinha = usadas.length % 2 === 0;
  const ultima = usadas[usadas.length - 1];
  const linhaDaVez = usadas.length === 0 ? 0 : vezDaLinha ? ultima[0] : null;
  const colunaDaVez = vezDaLinha ? null : ultima[1];
  const usada = (l, c) => usadas.some(([ul, uc]) => ul === l && uc === c);
  const naVez = (l, c) =>
    !usada(l, c) && (vezDaLinha ? l === linhaDaVez : c === colunaDaVez);
  const instaladas = partida.sequencias.map((seq) => contem(buffer, seq.codigos));
  const restanteMs = inicio === null ? limiteMs : Math.max(0, limiteMs - (agora - inicio));

  const terminar = useCallback(
    (venceu, motivo, ms) => {
      let recorde = false;
      if (venceu) {
        const anterior = lerRecordes()[nivel];
        recorde = !Number.isFinite(anterior) || ms < anterior;
        if (recorde) salvarRecorde(nivel, ms);
        avisarHud("breach");
      }
      setFim({ venceu, motivo, ms, recorde });
    },
    [nivel],
  );

  // Cronômetro: 4 atualizações por segundo bastam para a barra e os segundos
  useEffect(() => {
    if (inicio === null || fim) return undefined;
    const id = setInterval(() => setAgora(performance.now()), 250);
    return () => clearInterval(id);
  }, [inicio, fim]);

  useEffect(() => {
    if (inicio !== null && !fim && restanteMs === 0) terminar(false, "sem_tempo");
  }, [restanteMs, inicio, fim, terminar]);

  // Foco: na primeira casa livre da linha de cima ao abrir, e no
  // "Jogar de novo" quando a partida acaba
  useEffect(() => {
    if (fim) botaoDeNovo.current?.focus();
  }, [fim]);

  useEffect(() => {
    const [l, c] = foco;
    celulas.current[`${l},${c}`]?.focus({ preventScroll: true });
  }, [foco]);

  const escolher = (l, c) => {
    if (fim) return;
    if (!naVez(l, c)) {
      setAviso(t("hack.fora_da_vez"));
      return;
    }
    setAviso("");
    const t0 = inicio ?? performance.now();
    if (inicio === null) {
      setInicio(t0);
      setAgora(t0);
    }
    const proximas = [...usadas, [l, c]];
    setUsadas(proximas);
    const novoBuffer = proximas.map(([pl, pc]) => partida.grade[pl][pc]);
    const tudo = partida.sequencias.every((seq) => contem(novoBuffer, seq.codigos));
    if (tudo) terminar(true, "venceu", performance.now() - t0);
    else if (proximas.length >= partida.tamanhoBuffer) terminar(false, "buffer_cheio");
  };

  const mover = (e) => {
    const passos = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };
    const passo = passos[e.key];
    if (!passo) return;
    e.preventDefault();
    setFoco(([l, c]) => [(l + passo[0] + LADO) % LADO, (c + passo[1] + LADO) % LADO]);
  };

  const recomecar = () => {
    setPartida(novaPartida(nivel));
    setUsadas([]);
    setInicio(null);
    setAgora(0);
    setFim(null);
    setAviso("");
    setFoco([0, 0]);
    requestAnimationFrame(() => celulas.current["0,0"]?.focus({ preventScroll: true }));
  };

  const vez = vezDaLinha
    ? t("hack.vez_linha", { n: linhaDaVez + 1 })
    : t("hack.vez_coluna", { n: colunaDaVez + 1 });
  const recordeSalvo = fim ? lerRecordes()[nivel] : undefined;

  return (
    <div className="hack" ref={ref} onKeyDown={(e) => e.key === "Escape" && onExit?.()}>
      <p className="hack-titulo">
        {t("hack.titulo")} <span className="hack-nivel">// {t(`hack.nivel.${nivel}`)}</span>
      </p>
      <p className="hack-intro">{t("hack.intro")}</p>

      <div className="hack-corpo">
        <div
          className="hack-grade"
          role="group"
          aria-label={t("hack.grade")}
          aria-describedby="hack-vez"
          onKeyDown={mover}
        >
          {partida.grade.map((linha, l) =>
            linha.map((codigo, c) => {
              const livre = !usada(l, c);
              const ativa = !fim && (vezDaLinha ? l === linhaDaVez : c === colunaDaVez);
              const classes = ["hack-celula"];
              if (ativa) classes.push("hack-celula-vez");
              if (!livre) classes.push("hack-celula-usada");
              return (
                <button
                  key={`${l},${c}`}
                  ref={(el) => {
                    celulas.current[`${l},${c}`] = el;
                  }}
                  type="button"
                  className={classes.join(" ")}
                  tabIndex={foco[0] === l && foco[1] === c ? 0 : -1}
                  aria-disabled={fim || !naVez(l, c) ? "true" : undefined}
                  aria-label={
                    livre
                      ? t("hack.celula", { linha: l + 1, coluna: c + 1, codigo })
                      : t("hack.celula_usada", { linha: l + 1, coluna: c + 1 })
                  }
                  onFocus={() => setFoco([l, c])}
                  onClick={() => escolher(l, c)}
                >
                  {livre ? codigo : "[ ]"}
                </button>
              );
            }),
          )}
        </div>

        <div className="hack-painel">
          <p className="hack-rotulo">{t("hack.tempo")}</p>
          <RetroBar value={(restanteMs / limiteMs) * 100} label={t("hack.tempo")} />
          <p className="hack-dica">
            {inicio === null
              ? t("hack.tempo_parado")
              : t("hack.tempo_restante", { segundos: Math.ceil(restanteMs / 1000) })}
          </p>

          <p className="hack-rotulo">{t("hack.buffer")}</p>
          <ol className="hack-buffer" aria-label={t("hack.buffer")}>
            {Array.from({ length: partida.tamanhoBuffer }, (_, i) => (
              <li key={i} className={buffer[i] ? "hack-buffer-casa hack-buffer-cheia" : "hack-buffer-casa"}>
                {buffer[i] ?? ""}
              </li>
            ))}
          </ol>

          <p className="hack-rotulo">{t("hack.sequencias")}</p>
          <ul className="hack-sequencias">
            {partida.sequencias.map((seq, i) => {
              const estado = instaladas[i] ? "instalada" : fim ? "falhou" : null;
              return (
                <li key={seq.nome} className={estado ? `hack-seq hack-seq-${estado}` : "hack-seq"}>
                  <span className="hack-seq-codigos">{seq.codigos.join(" ")}</span>
                  <span className="hack-seq-nome">
                    {seq.nome}
                    {estado && ` · ${t(`hack.${estado}`)}`}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p id="hack-vez" className="hack-dica" aria-live="polite">
        {fim ? "" : aviso || vez} <span className="hack-teclado">{!fim && t("hack.teclado")}</span>
      </p>

      {fim && (
        <div className="hack-fim" role="status">
          <p className={fim.venceu ? "hack-fim-titulo cli-success" : "hack-fim-titulo"}>
            {fim.venceu ? t("hack.venceu", { tempo: segundos(fim.ms) }) : t(`hack.${fim.motivo}`)}
          </p>
          {fim.recorde && <p className="hack-dica">{t("hack.recorde")}</p>}
          {!fim.recorde && Number.isFinite(recordeSalvo) && (
            <p className="hack-dica">{t("hack.melhor", { tempo: segundos(recordeSalvo) })}</p>
          )}
        </div>
      )}

      <div className="hack-botoes">
        {fim && (
          <button type="button" className="btn-voltar-terminal" ref={botaoDeNovo} onClick={recomecar}>
            {t("hack.de_novo")}
          </button>
        )}
        {onExit && (
          <button type="button" className="btn-voltar-terminal" onClick={onExit}>
            {t("hack.voltar")}
          </button>
        )}
      </div>
    </div>
  );
};

export default Hack;
