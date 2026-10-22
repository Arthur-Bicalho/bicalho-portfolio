import registrar from "./registrar";

// Textos do comando "mapa" (components/Mapa.jsx)
registrar({
  pt: {
    mapa: {
      titulo: "Mapa de viagens",
      intro: "Os pontos acesos são os países onde já estive. Passe o mouse num ponto ou escolha um país abaixo.",
      mapa_alt: "Mapa-múndi em caracteres com {{count}} países marcados",
      paises: "Países visitados",
      dica: "Toque ou clique num país, ou digite mapa <país> (ex.: mapa alemanha).",
      nao_achei: "Não achei \"{{busca}}\" na lista. Os países marcados estão abaixo.",
      resumo: "{{paises}} países · {{continentes}} continentes",
    },
  },
  en: {
    mapa: {
      titulo: "Travel map",
      intro: "The lit points are the countries I've been to. Hover a point or pick a country below.",
      mapa_alt: "World map in characters with {{count}} countries marked",
      paises: "Countries visited",
      dica: "Tap or click a country, or type map <country> (e.g. map germany).",
      nao_achei: "I couldn't find \"{{busca}}\" in the list. The marked countries are below.",
      resumo: "{{paises}} countries · {{continentes}} continents",
    },
  },
});
