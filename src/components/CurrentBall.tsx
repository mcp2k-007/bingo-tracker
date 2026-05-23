// ============================================
// D-IA/NE BINGO TRACKER v1.1
// Composant : Encart "Boule en cours"
// ============================================
// Meme format/gabarit que le bouton BINGO (padding, taille texte,
// coins arrondis, bordure blanche). Affiche le dernier numero tire.

import { getLetterForNumber } from '../lib/bingoLogic'

interface CurrentBallProps {
  lastDrawn: number | null
}

function CurrentBall({ lastDrawn }: CurrentBallProps) {
  // Cas : aucun numero tire encore
  if (lastDrawn === null) {
    return (
      <div className="
        h-full
        bg-slate-800/60
        border-4 border-slate-600
        rounded-2xl
        px-6
        flex items-center justify-center gap-3
      ">
        <i className="fa-solid fa-circle-notch text-slate-500 text-xl sm:text-2xl"></i>
        <span className="font-display text-slate-400 text-lg sm:text-xl font-semibold uppercase tracking-wider">
          En attente du premier tirage...
        </span>
      </div>
    )
  }

  // La lettre correspondant au numero (ex: 52 -> G)
  const letter = getLetterForNumber(lastDrawn)

  return (
    <div
      key={lastDrawn}
      className="
        h-full
        bg-gradient-to-r from-red-600 to-rose-700
        border-4 border-white
        rounded-2xl
        px-6
        flex items-center justify-center gap-4
        shadow-lg shadow-red-500/30
        animate-popIn
      "
    >
      {/* Icone boule */}
      <i className="fa-solid fa-circle-dot text-white/80 text-xl sm:text-2xl"></i>

      {/* Libelle */}
      <span className="font-display text-white/80 text-lg sm:text-xl font-semibold uppercase tracking-wider">
        Boule&nbsp;:
      </span>

      {/* La lettre + le numero (meme taille que le texte BINGO) */}
      <span className="font-display text-white text-xl sm:text-2xl font-extrabold tracking-wider uppercase leading-none">
        {letter} - {lastDrawn}
      </span>
    </div>
  )
}

export default CurrentBall