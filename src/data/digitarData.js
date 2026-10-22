// Comando "digitar" (type): os trechos sorteados no teste de digitação.
// Cada um cabe numa linha do terminal (até ~70 caracteres) e só usa
// caracteres de um teclado comum. Acrescente à vontade.

export const trechos = [
  { tipo: "bash", texto: "sudo pacman -Syu && yay -S neovim" },
  { tipo: "bash", texto: "git commit -m \"fix: corrige o loop\" && git push" },
  { tipo: "bash", texto: "find . -name \"*.log\" -mtime +7 -delete" },
  { tipo: "bash", texto: "grep -rn \"TODO\" src | wc -l" },
  { tipo: "bash", texto: "chmod +x deploy.sh && ./deploy.sh --prod" },
  { tipo: "bash", texto: "tar -czvf backup.tar.gz ~/projetos" },
  { tipo: "bash", texto: "ssh -i ~/.ssh/id_ed25519 user@192.168.0.10" },
  { tipo: "c", texto: "for (int i = 0; i < n; i++) soma += v[i];" },
  { tipo: "c", texto: "int *p = malloc(n * sizeof(int)); if (!p) return 1;" },
  { tipo: "c", texto: "printf(\"%d %s\\n\", idade, nome);" },
  { tipo: "rust", texto: "let v: Vec<i32> = (1..=10).filter(|x| x % 2 == 0).collect();" },
  { tipo: "rust", texto: "fn main() { println!(\"Hello, {}!\", \"Galo\"); }" },
  { tipo: "rust", texto: "match res { Ok(v) => v, Err(e) => panic!(\"{e}\") }" },
  { tipo: "python", texto: "quadrados = [x ** 2 for x in range(10) if x % 2]" },
  { tipo: "python", texto: "with open(\"dados.csv\") as f: linhas = f.readlines()" },
  { tipo: "python", texto: "def fib(n): return n if n < 2 else fib(n-1) + fib(n-2)" },
  { tipo: "js", texto: "const pares = lista.filter((n) => n % 2 === 0);" },
  { tipo: "js", texto: "fetch(url).then((r) => r.json()).then(console.log);" },
  { tipo: "js", texto: "document.querySelector(\"#app\").classList.add(\"ativo\");" },
  { tipo: "js", texto: "export default function App() { return <Terminal />; }" },
];
