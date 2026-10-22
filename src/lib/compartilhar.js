// Link direto para um comando: seu-site/?cmd=<comando>&lang=<pt|en>, usado
// pelo comando "compartilhar" e pelo botão "copiar link" dos recentes da
// taskbar. O ?cmd= aceita até 60 caracteres (ver App.jsx).

export function linkDoComando(comando, idioma) {
  const url = new URL("/", window.location.origin);
  if (comando) url.searchParams.set("cmd", comando);
  url.searchParams.set("lang", idioma?.startsWith("en") ? "en" : "pt");
  return url.toString();
}

// Copia para a área de transferência; devolve true se deu certo
export async function copiarTexto(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}
