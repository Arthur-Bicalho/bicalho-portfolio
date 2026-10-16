import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSpotify } from "react-icons/fa";
import useCommandAtTop from "../terminal/useCommandAtTop";
import SPOTIFY_CONFIG from "../config/spotifyConfig";
import "./Spotify.css";

const { USER_ID, LASTFM, TRACK_ID } = SPOTIFY_CONFIG;

// Card de um serviço externo: se o serviço estiver fora do ar ou ainda sem
// login, a imagem some em vez de aparecer quebrada
function Card({ src, alt }) {
  const [falhou, setFalhou] = useState(false);
  if (falhou) return null;
  return <img alt={alt} height="400" src={src} onError={() => setFalhou(true)} />;
}

const Spotify = () => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  // Os cards vêm de serviços externos e demoram a carregar: a saída cresce a
  // cada imagem que chega e o hook leva o comando de volta para o topo, sem
  // nunca puxar quem já rolou para outro lugar
  useCommandAtTop(containerRef);

  if (!USER_ID && !LASTFM && !TRACK_ID) {
    return (
      <p className="comando-em-breve" ref={containerRef}>
        {t("comando.nao_configurado")}
      </p>
    );
  }

  return (
    <div className="spotify-container" ref={containerRef}>
      {USER_ID && (
        <a
          className="spotify-perfil"
          href={`https://open.spotify.com/user/${USER_ID}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaSpotify aria-hidden="true" />
          {t("spotify.perfil")}
        </a>
      )}
      <div className="spotify-recentes">
        {USER_ID && (
          <>
            <Card
              alt="Spotify"
              src={`https://spotify-github-profile.kittinanx.com/api/view?uid=${USER_ID}&cover_image=true&theme=default&show_offline=false&background_color=121212&interchange=false`}
            />
            <Card
              alt="Spotify list"
              src={`https://spotify-recently-played.jeffreyca.workers.dev/svg?user=${USER_ID}&count=10&width=540&radius=40&unique=1&duration=1&album=1&footer=wave`}
            />
          </>
        )}
        {LASTFM && (
          <a
            href={`https://www.last.fm/pt/user/${LASTFM}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card
              alt="lastfm"
              src={`https://lastfm-recently-played.jeffreyca.workers.dev/svg?user=${LASTFM}&count=10&radius=40&stats=compact&footer=wave&loved=off`}
            />
          </a>
        )}
      </div>
      {TRACK_ID && (
        <div>
          <iframe
            className="spotify-player"
            data-testid="embed-iframe"
            title="Spotify"
            src={`https://open.spotify.com/embed/track/${TRACK_ID}?utm_source=generator&theme=0`}
            width="875"
            height="352"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};

export default Spotify;
