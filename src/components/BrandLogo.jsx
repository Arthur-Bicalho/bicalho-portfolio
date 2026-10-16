import React from "react";

// Logo do portfólio: o prompt de terminal ">_" em vetor. Usa currentColor: a
// cor vem do CSS de quem usa (ex.: color: var(--text-muted)), então segue o
// tema. Decorativa por padrão (aria-hidden): passe "title" para ela ser lida.
// O mesmo desenho está em public/logo.svg e no favicon (public/favicon.svg).
const VIEWBOX = "0 0 200 200";
// Chevron ">" (traço grosso, pontas retas) e o cursor "_"
const CHEVRON = "M28 46 L56 18 L130 92 L130 108 L56 182 L28 154 L84 100 Z";
const CURSOR = "M110 154 H178 V182 H110 Z";

const BrandLogo = ({ className, title }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={VIEWBOX}
    className={className}
    fill="currentColor"
    role={title ? "img" : undefined}
    aria-hidden={title ? undefined : "true"}
    focusable="false"
  >
    {title && <title>{title}</title>}
    <path d={CHEVRON} />
    <path d={CURSOR} />
  </svg>
);

export default BrandLogo;
