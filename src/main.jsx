import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// Fonte dos títulos do HUD (só o peso 700, só o alfabeto latino: ~20 kB)
import "@fontsource/rajdhani/latin-700.css";
import "./theme/theme.css";
import "./App.css";
import App from "./App.jsx";
import ThemeProvider from "./theme/ThemeProvider";
import "./i18n";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Router: permite ler o ?cmd= dos links diretos (seu-site.vercel.app/?cmd=curriculo) */}
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
