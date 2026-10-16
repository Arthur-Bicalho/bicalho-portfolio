// Formatação de números e datas no idioma da página (usada pelo "stats")

// 31.76 → "31,8%" (pt) ou "31.8%" (en)
export function formatPercent(percent, locale) {
  if (percent > 0 && percent < 0.1) return `<${formatPercent(0.1, locale)}`;
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(percent / 100);
}

// "2022-09-06" → "6 de set. de 2022" / "Sep 6, 2022" (ou null se inválida)
export function formatDate(value, locale) {
  // Meio-dia no fuso do visitante: a data não "volta" um dia em nenhum fuso
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
