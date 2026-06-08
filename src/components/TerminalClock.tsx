// TerminalClock.tsx
// Horloge en direct, look "terminal" : juste l'heure, AUCUN cadre/bouton autour.
// Se place a gauche du bouton "En Direct" (haut droite).
// - Met a jour chaque seconde, mais affiche "xx h xx" (format 24h, sans secondes ni "min").
//   (React ne re-rend pas tant que la minute ne change pas : meme texte = pas de churn.)
// - tabular-nums : les chiffres ne "sautent" pas en changeant.
// - La prop className permet d'ajuster taille/couleur selon le voisin "En Direct".

import { useEffect, useState } from "react";

function formatNow(): string {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0"); // getHours() = deja 24h
  const mm = String(d.getMinutes()).padStart(2, "0");
  // Format "xx h xx" (ex: 16 h 05), 24h, sans secondes ni "min".
  return `${hh} h ${mm}`;
}

export default function TerminalClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string>(formatNow());

  useEffect(() => {
    const id = setInterval(() => setTime(formatNow()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      // Pas de bordure, pas de fond : c'est juste du texte facon afficheur.
      // font-bold + tracking-wide + tabular-nums pour le look "terminal" stable.
      className={
        "font-bold tabular-nums tracking-wide leading-none select-none " + className
      }
      aria-label="Heure courante"
    >
      {time}
    </span>
  );
}
