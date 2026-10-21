import i18n from "i18next";

// Textos dos comandos novos: cada um tem o seu arquivo em src/i18n/ e só
// desce junto com o chunk do comando, em vez de pesar no bundle inicial
// (src/i18n.js fica com as descrições da ajuda e as mensagens de uso).
//
//   registrar({ pt: { hack: {...} }, en: { hack: {...} } });
//
// Roda na importação do módulo, antes do primeiro render do componente.
// deep + overwrite: soma às chaves que já existem (ex.: hack.uso do i18n.js).
export default function registrar(textos) {
  for (const [lng, traducao] of Object.entries(textos)) {
    i18n.addResourceBundle(lng, "translation", traducao, true, true);
  }
}
