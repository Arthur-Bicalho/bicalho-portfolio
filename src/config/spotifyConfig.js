// spotifyConfig.js
// Comando "spotify". Cada card só aparece se o valor dele estiver preenchido;
// sem nenhum, o comando avisa que ainda não foi configurado.
//
//   USER_ID   seu ID de usuário do Spotify (open.spotify.com/user/<USER_ID>).
//             Mostra o link do perfil e dois cards de serviços que pedem
//             login uma vez com o Spotify (sem login, o card some):
//             https://spotify-github-profile.kittinanx.com/api/login e
//             https://spotify-recently-played.jeffreyca.workers.dev
//   LASTFM    seu usuário do Last.fm (opcional)
//   TRACK_ID  uma música para o player (open.spotify.com/track/<TRACK_ID>)
const SPOTIFY_CONFIG = {
  USER_ID: "21hpvdfa3cjqysyyxycxj2waa",
  LASTFM: "",
  TRACK_ID: "",
};

export default SPOTIFY_CONFIG;
