import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n/rm";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { avisarHud } from "../hud/eventos";
import "./RmRf.css";

// "rm -rf /" (ou "sudo rm -rf /"): os arquivos de src/ vão "sumindo", o HUD
// treme por 1,6 s e no fim vem o "brincadeira, faça backup!". Nada é apagado
// de verdade, e o terminal continua funcionando. Com reduced motion, a lista
// aparece de uma vez e o HUD não treme.
//
//   modo="rmrf"      a brincadeira
//   modo="negado"    rm <qualquer coisa>: permissão negada
//   modo="operando"  rm sozinho
//   modo="sudoers"   sudo <qualquer outra coisa>

// Arquivos de verdade do projeto, numa lista fixa (só os nomes)
const ARQUIVOS = [
  "src/main.jsx",
  "src/App.jsx",
  "src/App.css",
  "src/commands.js",
  "src/i18n.js",
  "src/hud/Hud.jsx",
  "src/hud/Hud.css",
  "src/hud/RetroLoader.jsx",
  "src/components/BoasVindas.jsx",
  "src/components/SobreMim.jsx",
  "src/components/Habilidades.jsx",
  "src/components/Projetos.jsx",
  "src/components/Jogos.jsx",
  "src/components/QuakeGame.jsx",
  "src/components/Hack.jsx",
  "src/components/Ctf.jsx",
  "src/components/Cifra.jsx",
  "src/components/Ranking.jsx",
  "src/components/Mapa.jsx",
  "src/components/Deutsch.jsx",
  "src/components/Digitar.jsx",
  "src/terminal/lazyCommand.jsx",
  "src/theme/theme.css",
  "src/data/sobreData.js",
];

const PASSO_MS = 70;

const semMovimento = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function Brincadeira() {
  const { t } = useTranslation();
  const [quantos, setQuantos] = useState(() => (semMovimento() ? ARQUIVOS.length : 0));

  useEffect(() => {
    if (semMovimento()) return undefined;
    avisarHud("glitch");
    const id = setInterval(() => {
      setQuantos((q) => {
        if (q + 1 >= ARQUIVOS.length) clearInterval(id);
        return Math.min(q + 1, ARQUIVOS.length);
      });
    }, PASSO_MS);
    return () => clearInterval(id);
  }, []);

  const terminou = quantos >= ARQUIVOS.length;
  return (
    <>
      <p className="rm-dim">{t("rm.apagando")}</p>
      <ul className="rm-lista" aria-hidden="true">
        {ARQUIVOS.slice(0, quantos).map((arquivo) => (
          <li key={arquivo}>{t("rm.removido", { arquivo })}</li>
        ))}
      </ul>
      {terminou && (
        <div className="rm-fim" role="status">
          <p className="rm-brincadeira">{t("rm.brincadeira")}</p>
          <p>{t("rm.backup")}</p>
        </div>
      )}
    </>
  );
}

const RmRf = ({ modo = "rmrf", alvo = "" }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  useCommandAtTop(ref);

  return (
    <div className="rm" ref={ref}>
      {modo === "rmrf" && <Brincadeira />}
      {modo === "negado" && <p className="rm-erro">{t("rm.negado", { alvo })}</p>}
      {modo === "operando" && <p className="rm-erro">{t("rm.operando")}</p>}
      {modo === "sudoers" && <p className="rm-erro">{t("rm.sudoers")}</p>}
    </div>
  );
};

export default RmRf;
