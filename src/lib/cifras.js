// Cifras e codificações do comando "cifra", sem React (fácil de testar).
// Tudo trabalha em UTF-8: "ç" vira dois bytes no Base64 e no hex.

const A = "a".charCodeAt(0);
const A_MAIUSCULO = "A".charCodeAt(0);

// Desloca só as letras de a–z (com ou sem maiúscula); acentos e o resto ficam
const deslocarLetra = (ch, n) => {
  const codigo = ch.charCodeAt(0);
  const base = codigo >= A && codigo < A + 26 ? A : codigo >= A_MAIUSCULO && codigo < A_MAIUSCULO + 26 ? A_MAIUSCULO : null;
  if (base === null) return ch;
  return String.fromCharCode(((((codigo - base + n) % 26) + 26) % 26) + base);
};

export const cesar = (texto, n) => [...texto].map((ch) => deslocarLetra(ch, n)).join("");

export const rot13 = (texto) => cesar(texto, 13);

// A chave só avança nas letras (como no Vigenère clássico)
export function vigenere(texto, chave, sentido = 1) {
  const deslocamentos = [...chave.toLowerCase()]
    .filter((ch) => ch >= "a" && ch <= "z")
    .map((ch) => ch.charCodeAt(0) - A);
  if (deslocamentos.length === 0) return texto;
  let i = 0;
  return [...texto]
    .map((ch) => {
      const novo = deslocarLetra(ch, sentido * deslocamentos[i % deslocamentos.length]);
      if (/[a-z]/i.test(ch)) i++;
      return novo;
    })
    .join("");
}

const bytes = (texto) => new TextEncoder().encode(texto);
// fatal: bytes que não formam UTF-8 viram erro, em vez de "�"
const deBytes = (b) => new TextDecoder("utf-8", { fatal: true }).decode(b);

export const paraBase64 = (t) => btoa(String.fromCharCode(...bytes(t)));

export function deBase64(b64) {
  const limpo = b64.replace(/\s+/g, "");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(limpo)) throw new Error("base64");
  return deBytes(Uint8Array.from(atob(limpo), (ch) => ch.charCodeAt(0)));
}

export const paraHex = (t) => [...bytes(t)].map((b) => b.toString(16).padStart(2, "0")).join(" ");

export function deHex(hex) {
  const limpo = hex.replace(/\s+|0x/gi, "");
  if (!/^([0-9a-f]{2})*$/i.test(limpo)) throw new Error("hex");
  return deBytes(Uint8Array.from(limpo.match(/../g) ?? [], (par) => parseInt(par, 16)));
}

// crypto.subtle só existe em página segura (https ou localhost)
export async function sha256(t) {
  if (!globalThis.crypto?.subtle) return null;
  const hash = await crypto.subtle.digest("SHA-256", bytes(t));
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
