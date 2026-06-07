// useLiveRadio.ts
// Hook qui pilote la diffusion audio en direct de CIGN-FM 96.7 (Radio Bingo).
// Gere un objet Audio HTML5 unique, le toggle Lecture/Pause, l'etat visuel
// (isPlaying) et les erreurs (autoplay bloque, flux indisponible).

import { useEffect, useRef, useState } from "react";

// ============================================================================
// FLUX CIGN-FM 96.7 - URL CONFIRMEE depuis le code source du lecteur (playerb.php) :
//   var stream = { mp3: "https://arcq.streamb.live/SB00259" }
// C'est du HTTPS natif (plateforme ARCQ / StreamB) -> AUCUN proxy necessaire,
// aucun probleme de contenu mixte. Lecture directe par <audio>.
const RADIO_STREAM_URL = "https://arcq.streamb.live/SB00259";
// ============================================================================

export function useLiveRadio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Initialise l'objet Audio une seule fois.
  useEffect(() => {
    const audio = new Audio(RADIO_STREAM_URL);
    audio.preload = "none"; // ne charge rien tant que l'utilisateur n'a pas clique
    audioRef.current = audio;

    const onPlay = () => {
      setIsPlaying(true);
      setHasError(false);
    };
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setHasError(true);
      setIsPlaying(false);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Bascule Lecture / Pause. Doit etre appele depuis un clic (politique autoplay iOS).
  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Allumage OPTIMISTE : le bouton s'allume tout de suite au clic.
      setHasError(false);
      setIsPlaying(true);
      // play() renvoie une promesse qui peut etre rejetee (autoplay bloque, flux indispo...)
      const p = audio.play();
      if (p !== undefined) {
        p.catch(() => {
          setHasError(true);
          setIsPlaying(false);
        });
      }
    }
  };

  return { isPlaying, hasError, toggle };
}
