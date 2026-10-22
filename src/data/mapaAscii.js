// Mapa-múndi do comando "mapa" em texto puro (projeção equiretangular), sem
// biblioteca. ":" é terra e "." é borda de terra. Cada caractere cobre DLON
// graus de longitude e cada linha, DLAT graus de latitude, a partir do canto
// de cima à esquerda (LON0, LAT0). Os marcadores dos países (data/paisesData.js)
// são posicionados com essas mesmas medidas.
//
// Foi gerado uma vez a partir de contornos bem simplificados dos continentes:
// para mudar o desenho, edite as linhas abaixo à mão.

export const MAPA = {
  LON0: -170,
  LAT0: 82,
  DLON: 4.5,
  DLAT: 7.5,
  LARGURA: 80,
};

export const MAPA_LINHAS = [
  "                      :::::::::::.                         ::",
  " .:::::::::::::::::::  .:::::::::         ::::. .:::::::::::::::::::::::::::::",
  " ::::::::::::::::::::::. :::::.        :::::::::::::::::::::::::::::::::::::::",
  "       .:::::::::::::::::           :: ::::::::::::::::::::::::::::::::::.",
  "          ::::::::::::::.            :::::::::::::::::::::::::::::::::::",
  "          ::::::::::::.            .::. .::::::::::::::::::::::::::...",
  "           .:::::::::               :::::::: ::::::::::::::::::::.  :",
  "            .::::  .              .::::::::::::::::::::::::::::::",
  "              .:::.               ::::::::::::::::   .::: ::::.",
  "                  ...:::.         ::::::::::::::.     ..    ::",
  "                    ::::::.         ::::::::::::           .::::",
  "                    ::::::::::          :::::::             .:::.",
  "                    .::::::::.          ::::::: .                 :::.",
  "                      ::::::.           :::::: ..              .:::::::",
  "                      :::::.             ::::                  :::::::::",
  "                     .:::.               .:.                   .::.::::.    .",
  "                     :::                                                   ::",
  "                     ::",
  "",
];
