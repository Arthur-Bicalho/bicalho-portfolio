// Gerado por scripts/ask.mjs (npm run ask). Não edite à mão: para mudar o
// que a IA do comando "pergunta" sabe, edite o currículo (public/cv-pt.pdf), os
// dados dos comandos ou o src/data/askData.js e rode de novo.
//
// Base de conhecimento que a função /api/ask manda para a IA junto com cada
// pergunta. Tudo aqui é público: está no site ou no currículo em PDF.

// Para o servidor calcular a idade no dia da pergunta
export const PERFIL_FATOS = {
  "geradoEm": "2026-10-16",
  "nascimento": {
    "ano": 2006,
    "mes": 9,
    "dia": 9
  }
};

export const PERFIL = `# Base de conhecimento sobre Arthur Bicalho Angelo

Gerada por npm run ask em 2026-10-16. A parte "Portfólio" é a mais atualizada; o "Currículo em PDF" (se houver) traz mais detalhes. Se os dois discordarem, vale o portfólio.

# Portfólio

## Identidade

- Nome: Arthur Bicalho Angelo
- Cargo: Estudante de Ciência da Computação na PUC Minas
- Lema: estudante de computação, construindo software no caminho
- Moro em: Belo Horizonte, MG
- Nascimento: 09/09/2006 (signo: Virgem)


## Quem sou

Sou estudante de Ciência da Computação na PUC Minas e membro da WebTech, a empresa júnior de tecnologia da universidade. Me interesso por cibersegurança, análise de dados e desenvolvimento de software, e venho praticando com projetos acadêmicos, problemas de algoritmos no Codeforces e projetos no GitHub. No Colégio Santo Antônio, fui diretor na Nona ONU e coordenador musical de uma produção teatral, e passei um ano de intercâmbio em Colônia, na Alemanha.


## O que faço hoje

- Estudante na PUC Minas: Bacharelado em Ciência da Computação (https://www.pucminas.br/)
- Membro da WebTech: Empresa júnior de tecnologia da PUC Minas · projetos web (https://webtech.network/)


## Formação

- 2026 – em andamento · Bacharelado em Ciência da Computação, PUC Minas
- Intercâmbio acadêmico (1 ano) em Colônia, Alemanha, Rodenkirchen Gesamtschule
- 2012 – 2025 · Ensino Fundamental e Médio, Colégio Santo Antônio


## Destaques

- Diretor na Nona ONU: Simulação da ONU organizada por alunos do Ensino Médio do Colégio Santo Antônio, para o 9º ano
- Coordenador musical de uma produção teatral: Colégio Santo Antônio
- Programação competitiva no Codeforces: Resolução de problemas algorítmicos


## Idiomas e interesses

- Português: nativo
- Inglês: fluente
- Alemão: bom domínio (um ano morando na Alemanha)
- Espanhol: intermediário
- Interesses: Cibersegurança, Análise de dados, Desenvolvimento de software


## Linguagens e ferramentas que uso (comando skills)

- C
- C++
- Python
- Java
- JavaScript
- React
- Node.js
- Rust
- HTML
- CSS
- Linux
- Arch Linux
- Fedora
- Git
- GitHub


## Fora do terminal

- Time: Atleticano, torço para o galão 🐓 (Clube Atlético Mineiro, o Galo; o site tem até um tema do Galo: tema --galo)
- Hobbies: tocar guitarra, projetos pessoais (sites e afins), ouvir música
- Música: Metalhead, mas escuto de tudo: de bossa nova a funk e thrash metal
- Lugares que já visitei: América do Sul: Brasil, Argentina, Chile; América do Norte: Estados Unidos; Europa: Alemanha, Portugal, Espanha, Itália, Holanda, Bélgica


## Lattes (comando lattes)

- Currículo Lattes: http://lattes.cnpq.br/4367583296858529


## Outras informações

- Para falar comigo, o melhor caminho é o comando \`contato\` (formulário que
  chega no meu e-mail) ou o e-mail arthurbangelo@gmail.com.
- Meus repositórios ficam no GitHub: github.com/Arthur-Bicalho.
- Uso Linux no dia a dia (Arch Linux e Fedora).
- Este portfólio é um terminal feito em React + Vite.


## Links

- GitHub: https://github.com/Arthur-Bicalho
- LinkedIn: https://www.linkedin.com/in/arthur-bicalho-angelo-bbba38188/
- Instagram: https://www.instagram.com/arthurbangelo/
- Lattes: http://lattes.cnpq.br/4367583296858529
- E-mail: arthurbangelo@gmail.com


## Comandos deste portfólio (para indicar ao visitante)

- \`sobre\` (ou \`about\`): Mostra quem sou: estudos, o que faço hoje e um pouco de mim fora do terminal.
- \`ajuda\` (ou \`help\`): Mostra esta lista de comandos disponíveis.
- \`contato\` (ou \`contact\`): Exibe minhas informações de contato e envia email.
- \`curriculo\` (ou \`resume\`): Exibe meu currículo com visualização em PDF.
- \`lattes\` (ou \`cnpq\`, \`academic\`): Mostra meu Currículo Lattes (lattes --pdf baixa o PDF).
- \`habilidades\` (ou \`skills\`): Exibe as linguagens e ferramentas que uso (skills --cards | --lista | --globo muda o estilo).
- \`tema\` (ou \`theme\`): Troca o tema na ordem escuro → claro → galo (tema --escuro | tema --claro | tema --galo).
- \`projetos\` (ou \`projects\`): Exibe meus projetos desenvolvidos.
- \`github\` (ou \`git\`, \`api\`): Exibe meus repositórios usando a GitHub API.
- \`spotify\` (ou \`music\`): Mostra o que estou ouvindo e últimas reproduções.
- \`stats\` (ou \`githubstats\`, \`ghstats\`): Mostra minhas estatísticas do GitHub (stats --repos | --tudo muda o gráfico).
- \`neofetch\` (ou \`fetch\`): Mostra as informações do sistema com o escudo do Galo, no estilo neofetch.
- \`campeonato\` (ou \`galo\`, \`atletico\`, \`championship\`): Próximos jogos do Galo: contagem regressiva e campeonato (campeonato --todos | --tabela).
- \`basquete\` (ou \`basketball\`, \`nba\`): Próximos jogos da NBA: contagem regressiva, logos dos times e TV (nba lal | nba --todos).
- \`jogo\` (ou \`quake\`, \`flappyplane\`, \`game\`): Jogos no terminal: o Quake original ou o Flappy Plane (jogo --quake | --flappyplane).
- \`guestbook\` (ou \`guest\`, \`book\`): Deixe uma mensagem no meu livro de visitas público.
- \`design\` (ou \`ds\`, \`designsystem\`): Mostra o design system do portfólio: fontes, cores, espaçamentos e marca.


# Currículo em PDF (public/cv-pt.pdf, comando curriculo)

Arthur Bicalho Angelo
Endereço para acessar este CV: https://lattes.cnpq.br/4367583296858529
Última atualização do currículo em 11/08/2026
Identificação
Nome Arthur Bicalho Angelo
Nascimento 09/09/2006 - Brasil
Lattes ID 4367583296858529
Nome em
citações
bibliográficas
ANGELO, A. B.
Endereço
Endereço
eletrônico
E-mail para contato : arthurbangelo@gmail.com
E-mail alternativo : arthurbangelo@gmail.com
Idiomas
Alemão Compreende Razoavelmente , Fala Razoavelmente , Escreve Razoavelmente , Lê Razoavelmente
Inglês Compreende Bem , Fala Bem , Escreve Bem , Lê Bem
Espanhol Compreende Razoavelmente , Fala Pouco , Escreve Pouco , Lê Razoavelmente
Formação acadêmica/titulação
2026 Graduação em Ciência da Computação.
Pontifícia Universidade Católica de Minas Gerais, PUC Minas, Belo Horizonte, Brasil
2012 - 2025 Ensino Médio (2o grau) .
Colégio Santo Antônio, CSA, Brasil, Ano de obtenção: 2025
Áreas de atuação
1. Grande área: Ciências Exatas e da Terra / Área: Ciência da Computação
Este arquivo não foi gerado a partir do Currículo Lattes validado e disponível publicamente e tem por finalidade apenas a conferência das
informações inseridas na plataforma.
Página gerada pelo sistema Currículo Lattes em 15/10/2026 às 15:40:53.
Estudante de Ciência da Computação no primeiro semestre da Pontifícia Universidade Católica de Minas Gerais (PUC Minas). Possui formação no Colégio Santo
Antônio, onde atuou como Diretor na Nona ONU simulação da Organização das Nações Unidas organizada por alunos do Ensino Médio e destinada aos estudantes do nono
ano e como Coordenador Musical em produção teatral desenvolvida pela instituição, experiências que consolidaram habilidades de liderança, organização de eventos e
trabalho em equipe. Realizou intercâmbio acadêmico de um ano na Rodenkirchen Gesamtschule, em Colônia, Alemanha, com fluência em inglês, bom domínio do alemão e
conhecimento intermediário de espanhol.Possui interesse nas áreas de cibersegurança, análise de dados e desenvolvimento de software. Iniciou sua trajetória prática por
meio de projetos acadêmicos, resolução de problemas algorítmicos na plataforma Codeforces e desenvolvimento de projetos disponibilizados no GitHub. Caracteriza-se por
perfil proativo, apreço por desafios intelectuais e facilidade em interações interpessoais. (Texto informado pelo autor)Imprimir
currículo
Currículo Lattes https://wwws.cnpq.br/cvlattesweb/pkg_impcv.trata
1 of 2 10/15/26, 15:41
`;
