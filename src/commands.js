import { nbaSubcommands } from './config/nbaConfig';

// Comandos do terminal. "subcommands" alimenta o autocomplete (Tab) da
// segunda palavra, ex.: "tema --c" + Tab → "tema --claro".
export const commandList = {
  sobre: {
    name: 'sobre',
    aliases: ['about'],
  },
  pergunta: {
    name: 'pergunta',
    aliases: ['ask', 'chat'],
    // pergunta <texto> (ou ask <texto>): a IA responde em primeira pessoa
    // (ver components/Ask.jsx); --nova | --new esquecem a conversa
    subcommands: ['--nova', '--new'],
  },
  ajuda: {
    name: 'ajuda',
    aliases: ['help'],
  },
  contato: {
    name: 'contato',
    aliases: ['contact'],
  },
  curriculo: {
    name: 'curriculo',
    aliases: ['resume'],
  },
  lattes: {
    name: 'lattes',
    aliases: ['cnpq', 'academic'],
    // Seções: lattes --resumo | --pdf (ver data/lattesData.js)
    subcommands: ['--resumo', '--pdf', '--summary'],
  },
  habilidades: {
    name: 'habilidades',
    aliases: ['skills'],
    // Estilos: skills --terminal | --cards | --lista | --globo (ver data/skillSkins.js)
    subcommands: ['--terminal', '--cards', '--lista', '--list', '--globo', '--globe'],
  },
  limpar: {
    name: 'limpar',
    aliases: ['clear'],
  },
  tema: {
    name: 'tema',
    aliases: ['theme'],
    // Sem opção, troca na ordem escuro → claro → galo
    subcommands: ['--escuro', '--claro', '--galo', '--dark', '--light'],
  },
  projetos: {
    name: 'projetos',
    aliases: ['projects'],
  },
  github: {
    name: 'github',
    aliases: ['git', 'api'],
  },
  spotify: {
    name: 'spotify',
    aliases: ['music'],
  },
  stats: {
    name: 'stats',
    aliases: ['githubstats', 'ghstats'],
    // Gráficos: stats --resumo | --linguagens | --atividade | --horarios | --repos | --tudo
    // (ver data/gitHubStatsSections.js)
    subcommands: [
      '--resumo',
      '--linguagens',
      '--atividade',
      '--horarios',
      '--repos',
      '--tudo',
      '--summary',
      '--languages',
      '--activity',
      '--hours',
      '--all',
    ],
  },
  neofetch: {
    name: 'neofetch',
    aliases: ['fetch'],
  },
  campeonato: {
    name: 'campeonato',
    aliases: ['galo', 'atletico', 'championship'],
    // Próximos jogos do Atlético Mineiro (ver components/Jogos.jsx);
    // --todos | --all mostram todos os jogos já marcados;
    // --tabela | --table mostram a classificação do Brasileirão
    subcommands: ['--todos', '--all', '--tabela', '--table'],
  },
  basquete: {
    name: 'basquete',
    aliases: ['basketball', 'nba'],
    // Próximos jogos da NBA (ver components/Basquete.jsx); a sigla ou o
    // apelido de um time filtram ("nba lal", "nba lakers") e --todos | --all
    // mostram todos os jogos dos próximos dias (ver config/nbaConfig.js)
    subcommands: nbaSubcommands,
  },
  jogo: {
    name: 'jogo',
    aliases: ['quake', 'flappyplane', 'game'],
    // "jogo", "game" e "quake" abrem o Quake shareware original (ver
    // components/QuakeGame.jsx e public/quake); "flappyplane" abre o
    // Flappy Plane. --quake | --flappyplane escolhem o jogo
    subcommands: ['--quake', '--flappyplane'],
  },
  guestbook: {
    name: 'guestbook',
    aliases: ['guest', 'book'],
    subcommands: ['add', 'list', 'help'],
  },
  design: {
    name: 'design',
    aliases: ['ds', 'designsystem'],
  },
};
