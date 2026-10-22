// Comando "quiz": 10 perguntas sobre mim, sorteadas deste banco. A primeira
// opção de cada pergunta é a certa (a ordem é embaralhada na hora). "comando"
// é onde está a resposta no portfólio, mostrado depois de responder.
// Todas as respostas saem do próprio site: ao mudar um fato no "sobre",
// confira se alguma pergunta daqui também muda.

export const perguntas = [
  {
    pt: "Em que universidade eu estudo?",
    en: "Which university do I attend?",
    opcoes: { pt: ["PUC Minas", "UFMG", "USP", "CEFET-MG"], en: ["PUC Minas", "UFMG", "USP", "CEFET-MG"] },
    comando: "sobre",
  },
  {
    pt: "Em que cidade da Alemanha eu fiz intercâmbio?",
    en: "In which German city did I spend my exchange year?",
    opcoes: { pt: ["Colônia", "Berlim", "Munique", "Hamburgo"], en: ["Cologne", "Berlin", "Munich", "Hamburg"] },
    comando: "mapa alemanha",
  },
  {
    pt: "Para que time eu torço?",
    en: "Which team do I support?",
    opcoes: {
      pt: ["Atlético Mineiro", "Cruzeiro", "América Mineiro", "Flamengo"],
      en: ["Atlético Mineiro", "Cruzeiro", "América Mineiro", "Flamengo"],
    },
    comando: "galo",
  },
  {
    pt: "Que instrumento eu toco?",
    en: "Which instrument do I play?",
    opcoes: { pt: ["Guitarra", "Bateria", "Piano", "Violino"], en: ["Guitar", "Drums", "Piano", "Violin"] },
    comando: "sobre",
  },
  {
    pt: "Que estilo musical mais combina comigo?",
    en: "Which music genre suits me best?",
    opcoes: { pt: ["Metal", "Sertanejo", "K-pop", "Música clássica"], en: ["Metal", "Sertanejo", "K-pop", "Classical"] },
    comando: "sobre",
  },
  {
    pt: "De que empresa júnior eu sou membro?",
    en: "Which junior enterprise am I a member of?",
    opcoes: { pt: ["WebTech", "DevLab Jr.", "CodeMinas", "Inova Jr."], en: ["WebTech", "DevLab Jr.", "CodeMinas", "Inova Jr."] },
    comando: "sobre",
  },
  {
    pt: "Onde eu pratico problemas de algoritmos?",
    en: "Where do I practice algorithm problems?",
    opcoes: { pt: ["Codeforces", "Kaggle", "Duolingo", "Stack Overflow"], en: ["Codeforces", "Kaggle", "Duolingo", "Stack Overflow"] },
    comando: "sobre",
  },
  {
    pt: "Quantos países eu já visitei?",
    en: "How many countries have I visited?",
    opcoes: { pt: ["10", "5", "3", "15"], en: ["10", "5", "3", "15"] },
    comando: "mapa",
  },
  {
    pt: "Em quantos continentes eu já estive?",
    en: "How many continents have I been to?",
    opcoes: { pt: ["3", "2", "4", "5"], en: ["3", "2", "4", "5"] },
    comando: "mapa",
  },
  {
    pt: "Em que cidade eu moro?",
    en: "Which city do I live in?",
    opcoes: {
      pt: ["Belo Horizonte", "São Paulo", "Rio de Janeiro", "Curitiba"],
      en: ["Belo Horizonte", "São Paulo", "Rio de Janeiro", "Curitiba"],
    },
    comando: "sobre",
  },
  {
    pt: "Que idioma eu falo bem por ter morado um ano fora?",
    en: "Which language do I speak well after living abroad for a year?",
    opcoes: { pt: ["Alemão", "Francês", "Italiano", "Japonês"], en: ["German", "French", "Italian", "Japanese"] },
    comando: "deutsch",
  },
  {
    pt: "Qual é o meu nível de espanhol?",
    en: "What's my level of Spanish?",
    opcoes: { pt: ["Intermediário", "Nativo", "Fluente", "Nenhum"], en: ["Intermediate", "Native", "Fluent", "None"] },
    comando: "sobre",
  },
  {
    pt: "Qual é o meu signo?",
    en: "What's my star sign?",
    opcoes: { pt: ["Virgem", "Leão", "Libra", "Escorpião"], en: ["Virgo", "Leo", "Libra", "Scorpio"] },
    comando: "sobre",
  },
  {
    pt: "Em que evento do colégio eu fui diretor?",
    en: "At which high school event was I a director?",
    opcoes: {
      pt: ["A Nona ONU", "A Olimpíada de Matemática", "A Feira de Ciências", "O Grêmio Estudantil"],
      en: ["The ninth Model UN", "The Math Olympiad", "The Science Fair", "The Student Council"],
    },
    comando: "sobre",
  },
  {
    pt: "Que função eu tive numa produção teatral do colégio?",
    en: "What was my role in a school theater production?",
    opcoes: {
      pt: ["Coordenador musical", "Ator principal", "Diretor", "Iluminador"],
      en: ["Music coordinator", "Lead actor", "Director", "Lighting designer"],
    },
    comando: "sobre",
  },
  {
    pt: "Em que colégio eu estudei?",
    en: "Which high school did I attend?",
    opcoes: {
      pt: ["Colégio Santo Antônio", "Colégio Loyola", "Colégio Magnum", "Colégio Bernoulli"],
      en: ["Colégio Santo Antônio", "Colégio Loyola", "Colégio Magnum", "Colégio Bernoulli"],
    },
    comando: "sobre",
  },
  {
    pt: "Qual destes é um dos meus interesses na computação?",
    en: "Which of these is one of my interests in computing?",
    opcoes: {
      pt: ["Cibersegurança", "Computação quântica", "Robótica industrial", "Design de jogos"],
      en: ["Cybersecurity", "Quantum computing", "Industrial robotics", "Game design"],
    },
    comando: "sobre",
  },
  {
    pt: "Qual destes sistemas operacionais está no meu cyberware?",
    en: "Which of these operating systems is in my cyberware?",
    opcoes: { pt: ["Arch Linux", "Windows XP", "Solaris", "BeOS"], en: ["Arch Linux", "Windows XP", "Solaris", "BeOS"] },
    comando: "skills",
  },
  {
    pt: "Que linguagem de sistemas moderna está nas minhas habilidades?",
    en: "Which modern systems language is in my skills?",
    opcoes: { pt: ["Rust", "COBOL", "Fortran", "Pascal"], en: ["Rust", "COBOL", "Fortran", "Pascal"] },
    comando: "skills",
  },
  {
    pt: "Em que ano eu comecei a graduação?",
    en: "What year did I start college?",
    opcoes: { pt: ["2026", "2023", "2024", "2025"], en: ["2026", "2023", "2024", "2025"] },
    comando: "sobre",
  },
];

export const RODADA = 10;
