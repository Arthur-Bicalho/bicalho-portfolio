import React from "react";
import { useTranslation } from "react-i18next";
import "./RetroLoader.css";

// Barra de progresso em blocos, no estilo das janelas antigas.
//   <RetroBar value={40} />   blocos acesos até 40%
//   <RetroBar />              sem valor: os blocos acendem em sequência e
//                             recomeçam (carregamento sem porcentagem)
export function RetroBar({ value, segments = 14, label }) {
  const indeterminada = value === undefined;
  const acesos = indeterminada ? segments : Math.round((value / 100) * segments);
  return (
    <div
      className={indeterminada ? "retro-bar retro-bar-indeterminada" : "retro-bar"}
      role="progressbar"
      aria-label={label}
      aria-valuemin={indeterminada ? undefined : 0}
      aria-valuemax={indeterminada ? undefined : 100}
      aria-valuenow={indeterminada ? undefined : value}
    >
      {Array.from({ length: segments }, (_, i) => (
        <span
          key={i}
          className={i < acesos ? "retro-bar-bloco retro-bar-aceso" : "retro-bar-bloco"}
          style={indeterminada ? { animationDelay: `${i * 0.12}s` } : undefined}
        />
      ))}
    </div>
  );
}

// Janela "System message" que aparece enquanto o código de um comando é
// baixado (ver terminal/lazyCommand.jsx). Some sozinha quando ele carrega.
export default function RetroLoader({ chave = "comando.carregando" }) {
  const { t } = useTranslation();
  const texto = t(chave);
  return (
    <div className="retro-loader" role="status">
      <div className="retro-loader-titulo">
        <span>System message</span>
        <span aria-hidden="true" className="retro-loader-fechar">
          ×
        </span>
      </div>
      <div className="retro-loader-corpo">
        <span aria-hidden="true" className="retro-loader-icone">
          !
        </span>
        <div className="retro-loader-texto">
          <span className="retro-loader-principal">{texto}</span>
          <span className="retro-loader-detalhe">{t("hud.loader_detalhe")}</span>
        </div>
      </div>
      <div className="retro-loader-barra">
        <RetroBar label={texto} />
      </div>
    </div>
  );
}
