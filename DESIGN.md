---
name: Arthur Bicalho Angelo · Portfólio Terminal
description: Portfólio em forma de terminal dentro de um HUD netrunner (cyberpunk), com temas escuro, claro e galo.
colors:
  netrunner-yellow: "#fcee0a"
  netrunner-yellow-hover: "#d9cc00"
  netrunner-yellow-focus: "#fff35c"
  breach-red: "#ff003c"
  ice-cyan: "#00f0ff"
  signal-green: "#39ff9c"
  void: "#0b0b0e"
  terminal-black: "#0f0f13"
  surface: "#18181e"
  track: "#1f1f25"
  taskbar: "#141418"
  border: "#3a3a42"
  border-input: "#4a4a55"
  text: "#e8e6d9"
  text-soft: "#d6d3c4"
  text-muted: "#a8a597"
  text-dim: "#8a8676"
  bevel-hi: "#fff7a0"
  bevel-lo: "#6b6400"
typography:
  hud-display:
    fontFamily: "Rajdhani, sans-serif"
    fontWeight: 700
    letterSpacing: "0.16em"
  hud-label:
    fontFamily: "Rajdhani, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    letterSpacing: "0.2em"
  body:
    fontFamily: "FiraCode, JetBrainsMono, Consolas, Monaco, monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  hint:
    fontFamily: "FiraCode, monospace"
    fontSize: "0.85rem"
    fontWeight: 400
rounded:
  none: "0px"
  button: "8px"
spacing:
  bar-gap: "3px"
  panel: "16px"
  block: "1.5rem"
components:
  retro-bar:
    backgroundColor: "{colors.void}"
    height: "22px"
    padding: "3px"
  retro-bar-block-lit:
    backgroundColor: "{colors.netrunner-yellow}"
  retro-loader-title:
    backgroundColor: "{colors.netrunner-yellow}"
    textColor: "{colors.void}"
    typography: "{typography.hud-display}"
    height: "26px"
  retro-loader:
    backgroundColor: "{colors.terminal-black}"
    width: "min(380px, 100%)"
  button-voltar:
    backgroundColor: "{colors.netrunner-yellow}"
    textColor: "{colors.void}"
    rounded: "{rounded.button}"
    padding: "0.8rem"
  button-voltar-hover:
    backgroundColor: "{colors.netrunner-yellow-hover}"
  hud-panel:
    rounded: "{rounded.none}"
    padding: "{spacing.panel}"
  taskbar-button:
    backgroundColor: "{colors.track}"
    textColor: "{colors.netrunner-yellow}"
    typography: "{typography.hud-display}"
---

# Design System: Arthur Bicalho Angelo · Portfólio Terminal

## Overview

**Creative North Star: "Netrunner HUD"**

O site é um terminal (react-terminal-ui) cercado por um HUD de netrunner no estilo Cyberpunk 2077: um cabeçalho com faixa amarela chanfrada, o painel do perfil à esquerda, o BREACH PROTOCOL e as gigs à direita e uma taskbar retrô embaixo, com relevo de Windows 9x. O terminal no centro é o produto, e o HUD só oferece atalhos que digitam comandos nele. Nada abre página nova nem aba, e **o único rolamento é o do terminal**: a página inteira cabe na viewport (`100dvh`, `overflow: hidden`).

A densidade é de console. O texto é monoespaçado (FiraCode) sobre quase preto, e os rótulos do HUD usam Rajdhani em caixa alta com tracking largo. Três cores elétricas (amarelo, vermelho e ciano) aparecem em pontos de sinal, nunca como fundos grandes. O relevo retrô (bordas claras e escuras de 2px) e os cantos cortados com `clip-path` são as duas assinaturas de forma. A partir de 1180px de largura os painéis laterais somem e o terminal ocupa a tela.

Cada comando é uma "saída" do terminal: um bloco que aparece abaixo da linha digitada e herda a fonte e o tamanho do terminal. Os comandos interativos (jogos, formulários) pausam o terminal e devolvem o foco a ele quando fecham.

**Key Characteristics:**
- Terminal no centro, HUD em volta e uma taskbar retrô; zero rolagem da página.
- Monoespaçado para o conteúdo, Rajdhani em caixa alta para os rótulos do HUD.
- Amarelo netrunner como sinal principal; vermelho e ciano como sinais secundários.
- Relevo retrô (bevel de 2px) e cantos chanfrados com `clip-path`; quase nada é arredondado.
- Três temas trocam só tokens (`:root` / `[data-theme="light"]` / `[data-theme="galo"]`) em `src/theme/theme.css`.

## Colors

A paleta é neon sobre um preto quase absoluto: o amarelo faz o trabalho pesado, e o vermelho e o ciano são sinais pontuais. Os valores do frontmatter são os do tema escuro (padrão). Os temas claro e galo redefinem os mesmos tokens em `src/theme/theme.css`, e os componentes usam **apenas `var(--token)`**.

### Primary
- **Netrunner Yellow** (`--accent`, `--hud-fill`, `--hud-line`): faixas de título, prompt, botões principais, blocos acesos da `RetroBar`, bordas dos painéis e links. No tema galo vira o amarelo da estrela do escudo; no tema claro, os fundos continuam amarelos e textos e bordas passam a oliva escuro.

### Secondary
- **Breach Red** (`--hud-red`): alertas, o ícone "!" do RetroLoader, os quadradinhos de "cyberware" e o painel vermelho. No tema galo vira branco.

### Tertiary
- **ICE Cyan** (`--hud-cyan`, `--info`): foco dos botões da taskbar, informações secundárias e o painel ciano.
- **Signal Green** (`--success`): mensagens de sucesso (`.cli-success`).

### Neutral
- **Void** (`--bg-page`, `--hud-inset`, `--on-accent`): fundo da página, interior das barras e texto sobre o amarelo.
- **Terminal Black** (`--bg-terminal`): fundo do terminal e das janelas retrô.
- **Surface / Track / Taskbar** (`--surface`, `--track`, `--hud-taskbar`, `--hud-button`): cards, trilhos de barras e botões neutros.
- **Texto** (`--text` 15:1, `--text-soft`, `--text-muted` 8:1, `--text-dim` 5:1): hierarquia de leitura.
- **Grid / Panel / Outline** (`--hud-grid`, `--hud-panel`, `--hud-outline`): tintas translúcidas do HUD (grade do fundo, painéis, contorno das letras grandes).

### Named Rules
**The Token-Only Rule.** Nenhum CSS de componente escreve uma cor literal; tudo vem de `var(--…)` em `theme.css`, então os três temas funcionam de graça.

**The Signal Rule.** Vermelho e ciano marcam estado ou alerta e nunca pintam áreas grandes. O amarelo pinta faixas e botões, mas não fundos de bloco inteiros.

## Typography

**Display Font:** Rajdhani 700 (`@fontsource/rajdhani`), com fallback sans-serif
**Body Font:** FiraCode (com fallback JetBrainsMono, Consolas, Monaco, monospace)

**Character:** a Rajdhani condensada em caixa alta dá a voz de interface militar e futurista do HUD; a FiraCode mantém tudo que é conteúdo com cara de terminal.

### Hierarchy
- **HUD display** (Rajdhani 700, 14px, tracking 0.16em, caixa alta): faixas de título (RetroLoader, cabeçalho, taskbar).
- **HUD label** (Rajdhani 700, 13px, tracking 0.2em, caixa alta): títulos dos painéis (`.hud-painel-titulo`).
- **Body** (FiraCode 400, 1rem; 0.9rem ≤768px; 0.85rem ≤480px; altura de linha 1.5em): todo o conteúdo do terminal. Os componentes herdam o tamanho do `.react-terminal-wrapper` em vez de fixar o próprio.
- **Hint** (FiraCode, 0.85rem, `--text-dim`): dicas e instruções (`.cli-hint`).

### Named Rules
**The Inherit Rule.** Saídas de comando herdam a fonte e o tamanho do terminal (`font-family: inherit` também em botões e inputs). Só os rótulos do HUD usam Rajdhani.

**The 16px Input Rule.** Todo campo digitável tem `font-size` ≥ 16px no celular para o iOS não dar zoom.

## Layout

A tela tem um grid fixo de viewport (`100dvh`, sem rolagem): o cabeçalho em cima, as colunas de perfil, terminal e painéis da direita no meio e a taskbar embaixo. O terminal é a única área que rola (`.react-terminal`, `overflow-y: auto`, `overflow-x: hidden`). Os pontos de quebra são estes:
- **>1180px:** HUD completo com as colunas laterais. Com altura ≤800px e ≤640px, os painéis ficam mais compactos.
- **≤1180px:** os painéis laterais somem e o terminal ocupa a largura toda.
- **≤900px / ≤768px / ≤420px:** a taskbar e o cabeçalho se compactam, e os botões de ação ocupam 100% da largura.

As saídas de comando são blocos em coluna (`display: flex; flex-direction: column; gap: 1.5rem`), com `min-width: 0` e `overflow-wrap: anywhere` em textos de visitantes, para nunca causar rolagem lateral em 375px. O comando executado vai para o topo do terminal (`keepLastCommandAtTop`, `useCommandAtTop`).

## Elevation & Depth

A profundidade vem do **relevo retrô** e não de sombras difusas. Elementos "para fora" (botões, janelas) têm borda clara em cima e à esquerda (`--hud-bevel-hi`) e escura embaixo e à direita (`--hud-bevel-lo`). Elementos "para dentro" (barras, campos, botão pressionado) invertem as cores. A única sombra estrutural é a sombra dura das janelas retrô.

### Shadow Vocabulary
- **Janela retrô** (`box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.45)`): RetroLoader e janelas "System message".
- **Hover de card** (`--shadow-project-hover`, `--shadow-xp-hover`): brilho amarelo bem fraco nos cards de projeto e experiência.

### Named Rules
**The Bevel Rule.** Se precisa parecer clicável, use o bevel de 2px e não uma sombra suave. Pressionado ou ativo inverte o bevel.

## Shapes

Os cantos são retos (`border-radius: 0`) e chanfrados com `clip-path`: o canto inferior direito dos painéis (20px), a faixa do título com a ponta diagonal (22px), o botão iniciar (12px) e o ícone "!" com o canto cortado. A exceção é o botão "Voltar ao terminal" (`.btn-voltar-terminal`, raio 8px), que vem do visual anterior e continua igual. A grade do fundo usa linhas de 1px em `--hud-grid`.

## Components

### RetroBar (barra em blocos)
O sinal de progresso do site (`src/hud/RetroLoader.jsx`, `<RetroBar value? segments=14 label />`).
- **Forma:** caixa de 22px com bevel invertido (para dentro), fundo `--hud-inset`, 3px de padding e blocos de até 16px com 3px de espaço.
- **Determinada:** os blocos acesos em `--hud-fill` vão até `value`%, com `role="progressbar"` e `aria-valuenow`.
- **Indeterminada:** os blocos acendem em sequência (`steps(1)`). Com reduced motion, ficam todos acesos e parados.
- Serve para cronômetros, progresso e carregamento. Não invente outra barra.

### RetroLoader (janela "System message")
A janela retrô mostrada pelo `lazyCommand` enquanto o código do comando baixa: faixa de título amarela com "×", ícone "!" vermelho chanfrado, texto principal e detalhe `--hud-dim` e uma `RetroBar` indeterminada. É a referência para mensagens de confirmação no estilo do sistema.

### Botão "Voltar ao terminal"
`.btn-voltar-terminal` (`src/components/BotaoVoltar.css`): fundo `--accent`, texto `--on-accent`, raio 8px, negrito, 0.85rem e 100% de largura ≤768px. Todo comando interativo fecha com ele (ou com Esc) e devolve o foco ao input do terminal.

### Painéis do HUD
`.hud-painel` mais a variante `-amarelo` / `-ciano` / `-vermelho`: borda de 1px na cor do sinal, fundo `--hud-panel`, 16px de padding, título em HUD label e canto chanfrado no amarelo.

### Taskbar e comandos recentes
Barra `--hud-taskbar` com borda superior amarela de 2px. O botão iniciar é amarelo chanfrado com bevel, os botões neutros são `--hud-button` com bevel neutro, o pressionado usa `--hud-inset` com bevel invertido e o foco tem outline ciano de 2px.

### BREACH PROTOCOL
Grade 5×5 de códigos hex no painel da direita; a coluna ativa acende em sequência (`.hud-breach-ativa`, sem animação com reduced motion).

### Saídas de comando em CLI
O vocabulário de classes que os comandos reaproveitam: `.command` (amarelo, 600), `.command-desc` (`--text-muted`), `.cli-hint` (dica), `.cli-success` (verde), `.cli-input-line` / `.cli-prefix` (campos de linha em estilo prompt), entradas com borda esquerda amarela (`border-left: 2px solid var(--accent)`) e `.autocomplete-options` (opções lado a lado). As classes `.command*` e `.cli-*` ficam em `src/components/Cli.css`, que cada comando importa (como o `BotaoVoltar.css`).

### Barras em caracteres
Gráficos dentro do terminal usam blocos de texto: `█` cheio e a fração da ponta em `▓▒░` (`ranking`), ou um bloco por unidade (`galo --stats`: `█` marcados em `--hud-line`, `▒` sofridos em `--hud-red`). Sempre com `white-space: pre`, `letter-spacing: 0` e `aria-hidden`, com o número em texto ao lado para leitores de tela. No `ranking`, as barras crescem com `scaleX` a partir da esquerda (600ms, `cubic-bezier(0.23, 1, 0.32, 1)`, 50ms entre uma e outra); com reduced motion, só fade. Percentual de 0 a 100 usa a `RetroBar` (aproveitamento do `galo --stats`).

### Recados para o HUD
Um comando fala com o HUD por um evento na `window` (`avisarHud("breach")`, em `src/hud/eventos.js`), sem contexto do React. Hoje o único é o "ACCESS GRANTED" que o `hack` acende no BREACH PROTOCOL: uma faixa amarela que entra em 200ms (`cubic-bezier(0.23, 1, 0.32, 1)`) e, com reduced motion, só aparece com um fade.

## Do's and Don'ts

### Do:
- **Do** carregar todo comando novo com `lazyCommand` (`src/terminal/lazyCommand.jsx`) e registrá-lo em `src/commands.js` com nome pt e aliases en.
- **Do** usar só tokens `--hud-*` e os tokens de texto e superfície de `theme.css`, e conferir nos três temas (`tema --escuro|--claro|--galo`).
- **Do** usar a `RetroBar` para qualquer progresso ou cronômetro e o RetroLoader como modelo de janela de confirmação.
- **Do** animar só `transform` e `opacity`, curto, com `@media (prefers-reduced-motion: reduce)` desligando o movimento.
- **Do** devolver o foco ao terminal ao sair de um comando interativo e manter tudo operável por teclado.
- **Do** testar em 375px: zero rolagem horizontal e `overflow-wrap: anywhere` em textos de visitantes.
- **Do** colocar os textos dos comandos novos em `src/i18n/<comando>.js` (pt e en), carregados junto com o chunk do comando. No `src/i18n.js` ficam só as descrições da ajuda e as mensagens de uso.

### Don't:
- **Don't** criar páginas, abas, rolagem da página inteira ou bibliotecas de UI; o único rolamento é o do terminal.
- **Don't** mudar cores, fontes, o layout do HUD ou os temas existentes.
- **Don't** escrever cores literais no CSS de componente nem usar `border-radius` arredondado fora do botão "Voltar".
- **Don't** usar sombras difusas para profundidade: use o bevel retrô.
- **Don't** usar `dangerouslySetInnerHTML` ou `innerHTML`.
