const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Sem as variáveis no .env.local (ex.: quem acabou de clonar o repositório),
// o client não é criado: o portfólio abre normalmente e só o guestbook fica indisponível.
export const supabaseConfigurado = Boolean(supabaseUrl && supabaseKey);

if (!supabaseConfigurado) {
  console.warn(
    "Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no .env.local para usar o guestbook."
  );
}

// O @supabase/supabase-js (~45 kB gzip) só desce quando alguém precisa dele
// (contador de visitas, guestbook, ctf), num chunk à parte: não pesa na
// abertura do site. Uma promessa só para todos; se o download falhar, a
// próxima chamada tenta de novo.
//
//   const supabase = await obterSupabase();   // null sem as variáveis ou sem rede
let promessa = null;

export function obterSupabase() {
  if (!supabaseConfigurado) return Promise.resolve(null);
  promessa ??= import("@supabase/supabase-js")
    .then(({ createClient }) => createClient(supabaseUrl, supabaseKey))
    .catch((error) => {
      console.error("Não consegui carregar o Supabase:", error);
      promessa = null;
      return null;
    });
  return promessa;
}
