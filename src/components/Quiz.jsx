import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n/quiz";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { perguntas, RODADA } from "../data/quizData";
import "./BotaoVoltar.css";
import "./Quiz.css";

// "quiz": RODADA perguntas sorteadas de data/quizData.js. Responde com as
// teclas 1–4 ou clicando; depois de cada resposta aparece se acertou e o
// comando que tem a resposta. No fim, a nota, um comentário e os comandos
// das que errou.

const embaralhar = (lista) => {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
};

// Cada pergunta guarda a ordem das opções: [índice original, ...] (0 = certa)
const novaRodada = () =>
  embaralhar(perguntas)
    .slice(0, RODADA)
    .map((pergunta) => ({ ...pergunta, ordem: embaralhar([0, 1, 2, 3]) }));

const comentarioDa = (acertos, total) => {
  if (acertos === total) return "perfeito";
  if (acertos >= total * 0.7) return "bom";
  if (acertos >= total * 0.4) return "medio";
  return "baixo";
};

const Quiz = ({ onExit }) => {
  const { t, i18n } = useTranslation();
  const lingua = i18n.language.startsWith("en") ? "en" : "pt";
  const ref = useRef(null);
  const foco = useRef(null);
  useCommandAtTop(ref);

  const [rodada, setRodada] = useState(novaRodada);
  const [atual, setAtual] = useState(0);
  const [respostas, setRespostas] = useState([]); // índice original escolhido
  const respondida = respostas.length > atual;
  const fim = atual >= rodada.length;
  const pergunta = rodada[atual];

  // Foco: no grupo de opções a cada pergunta, no "Próxima" depois de
  // responder e no "Jogar de novo" no fim
  useEffect(() => {
    foco.current?.focus({ preventScroll: true });
  }, [atual, respondida, fim]);

  const responder = (posicao) => {
    if (fim || respondida) return;
    setRespostas((r) => [...r, pergunta.ordem[posicao]]);
  };

  const avancar = () => setAtual((a) => a + 1);

  const recomecar = () => {
    setRodada(novaRodada());
    setAtual(0);
    setRespostas([]);
  };

  const teclas = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onExit?.();
      return;
    }
    if (fim) return;
    if (!respondida && /^[1-4]$/.test(e.key)) {
      e.preventDefault();
      responder(Number(e.key) - 1);
    } else if (respondida && e.key === "Enter" && e.target.tagName !== "BUTTON") {
      e.preventDefault();
      avancar();
    }
  };

  const acertos = respostas.filter((r) => r === 0).length;
  const errados = [...new Set(rodada.filter((p, i) => respostas[i] !== 0).map((p) => p.comando))];

  return (
    <div className="quiz" ref={ref} onKeyDown={teclas}>
      <p className="quiz-titulo">{t("quiz.titulo")}</p>

      {!fim && (
        <>
          <p className="quiz-progresso">{t("quiz.progresso", { n: atual + 1, total: rodada.length })}</p>
          <p className="quiz-pergunta" id="quiz-pergunta">
            {pergunta[lingua]}
          </p>
          <div
            className="quiz-opcoes"
            role="group"
            aria-labelledby="quiz-pergunta"
            tabIndex={-1}
            ref={respondida ? undefined : foco}
          >
            {pergunta.ordem.map((original, posicao) => {
              const escolhida = respondida && respostas[atual] === original;
              const classes = ["quiz-opcao"];
              if (respondida && original === 0) classes.push("quiz-opcao-certa");
              if (escolhida && original !== 0) classes.push("quiz-opcao-errada");
              return (
                <button
                  key={original}
                  type="button"
                  className={classes.join(" ")}
                  aria-disabled={respondida ? "true" : undefined}
                  onClick={() => responder(posicao)}
                >
                  <span className="quiz-numero">[{posicao + 1}]</span> {pergunta.opcoes[lingua][original]}
                </button>
              );
            })}
          </div>

          {respondida ? (
            <div className="quiz-retorno" role="status">
              <p className={respostas[atual] === 0 ? "quiz-certo" : "quiz-errado"}>
                {respostas[atual] === 0
                  ? t("quiz.certo")
                  : t("quiz.errado", { resposta: pergunta.opcoes[lingua][0] })}{" "}
                <span className="quiz-dim">{t("quiz.onde", { comando: pergunta.comando })}</span>
              </p>
              <button type="button" className="btn-voltar-terminal" ref={foco} onClick={avancar}>
                {t("quiz.proxima")}
              </button>
            </div>
          ) : (
            <p className="quiz-dim quiz-teclado">{t("quiz.teclado")}</p>
          )}
        </>
      )}

      {fim && (
        <div className="quiz-fim" role="status">
          <p className="quiz-resultado">{t("quiz.resultado", { acertos, total: rodada.length })}</p>
          <p>{t(`quiz.comentario.${comentarioDa(acertos, rodada.length)}`)}</p>
          {errados.length > 0 && (
            <p className="quiz-dim">
              {t("quiz.revisar")} <span className="quiz-comandos">{errados.join(" · ")}</span>
            </p>
          )}
        </div>
      )}

      <div className="quiz-botoes">
        {fim && (
          <button type="button" className="btn-voltar-terminal" ref={foco} onClick={recomecar}>
            {t("quiz.de_novo")}
          </button>
        )}
        {onExit && (
          <button type="button" className="btn-voltar-terminal" onClick={onExit}>
            {t("quiz.voltar")}
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
