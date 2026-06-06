// useLiveRadio.ts
// Hook qui pilote la diffusion audio en direct de CIGN-FM 96.7 (Radio Bingo).
// Gere un objet Audio HTML5 unique, le toggle Lecture/Pause, l'etat visuel
// (isPlaying) et les erreurs (autoplay bloque, flux indisponible).

import { useEffect, useRef, useState } from "react";

// ============================================================================
// FLUX CIGN-FM 96.7 (mount trouve dans la console : cignfm128.mp3 sur StatsRadio).
// !!! A VALIDER : le SCHEMA exact (http/https) et un eventuel PORT.
// CONTRAINTE CLE : notre app est en HTTPS (Vercel). Le navigateur BLOQUE
// l'audio HTTP sur une page HTTPS (contenu mixte). Il NOUS FAUT une URL https://.
//   - Si la version https ci-dessous joue -> parfait.
//   - Si elle refuse (flux http-only) -> on passera par un proxy Vercel en v1.3.
// Verifier dans DevTools (Network -> cignfm128.mp3 -> Headers -> Request URL).
const RADIO_STREAM_URL = "https://stream06.ustream.ca/cignfm128.mp3";
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
    } else {
      // play() renvoie une promesse qui peut etre rejetee (autoplay bloque, etc.)
      const p = audio.play();
      if (p !== undefined) {
        p.catch(() => setHasError(true));
      }
    }
  };

  return { isPlaying, hasError, toggle };
}
