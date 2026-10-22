// Países que já visitei, no comando "mapa" (a lista de lugares é a mesma do
// "sobre", em data/sobreData.js; o nome vem de sobre.pessoal.lugares.<id>).
//
//   lat, lon   onde o marcador acende no mapa (a cidade que visitei, ou a capital)
//   nomes      o que vale em "mapa <país>", além da sigla (sem acento, minúsculo)
//   pt, en     o texto curto que aparece ao passar o mouse, tocar ou focar
//
// Os textos marcados como "provisório" são genéricos: troque por uma lembrança sua.

export const paises = [
  {
    id: "brasil",
    sigla: "BR",
    lat: -19.9,
    lon: -43.9,
    nomes: ["brasil", "brazil"],
    pt: "Casa: Belo Horizonte, Minas Gerais.",
    en: "Home: Belo Horizonte, Minas Gerais.",
  },
  {
    id: "argentina",
    sigla: "AR",
    lat: -34.6,
    lon: -58.4,
    nomes: ["argentina"],
    // provisório: troque por uma lembrança sua
    pt: "Carimbo no passaporte.",
    en: "Passport stamp.",
  },
  {
    id: "chile",
    sigla: "CL",
    lat: -33.4,
    lon: -70.6,
    nomes: ["chile"],
    // provisório: troque por uma lembrança sua
    pt: "Carimbo no passaporte.",
    en: "Passport stamp.",
  },
  {
    id: "estados_unidos",
    sigla: "US",
    lat: 38.9,
    lon: -77,
    nomes: ["estados unidos", "eua", "usa", "united states"],
    // provisório: troque por uma lembrança sua
    pt: "Carimbo no passaporte.",
    en: "Passport stamp.",
  },
  {
    id: "alemanha",
    sigla: "DE",
    lat: 50.9,
    lon: 6.96,
    nomes: ["alemanha", "germany", "deutschland"],
    pt: "Um ano de intercâmbio em Colônia. Daí vem o meu alemão (veja o comando deutsch).",
    en: "A year as an exchange student in Cologne. That's where my German comes from (try the deutsch command).",
  },
  {
    id: "portugal",
    sigla: "PT",
    lat: 38.7,
    lon: -9.1,
    nomes: ["portugal"],
    // provisório: troque por uma lembrança sua
    pt: "Carimbo no passaporte.",
    en: "Passport stamp.",
  },
  {
    id: "espanha",
    sigla: "ES",
    lat: 40.4,
    lon: -3.7,
    nomes: ["espanha", "spain", "espana"],
    // provisório: troque por uma lembrança sua
    pt: "Carimbo no passaporte.",
    en: "Passport stamp.",
  },
  {
    id: "italia",
    sigla: "IT",
    lat: 41.9,
    lon: 12.5,
    nomes: ["italia", "italy"],
    // provisório: troque por uma lembrança sua
    pt: "Carimbo no passaporte.",
    en: "Passport stamp.",
  },
  {
    id: "holanda",
    sigla: "NL",
    lat: 52.4,
    lon: 4.9,
    nomes: ["holanda", "paises baixos", "netherlands", "holland"],
    // provisório: troque por uma lembrança sua
    pt: "Carimbo no passaporte.",
    en: "Passport stamp.",
  },
  {
    id: "belgica",
    sigla: "BE",
    lat: 50.8,
    lon: 4.4,
    nomes: ["belgica", "belgium"],
    // provisório: troque por uma lembrança sua
    pt: "Carimbo no passaporte.",
    en: "Passport stamp.",
  },
];

// "Itália", "italy", "IT" → o país (ou null)
const semAcento = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/-/g, " ")
    .trim();

export function acharPais(busca) {
  const alvo = semAcento(busca ?? "");
  if (!alvo) return null;
  return paises.find((p) => p.sigla.toLowerCase() === alvo || p.nomes.includes(alvo)) ?? null;
}
