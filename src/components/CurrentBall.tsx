// ============================================
// D-IA-NE BINGO TRACKER v1.0
// Composant : Encart "Boule en cours"
// ============================================
// Affiche en GROS le dernier numero tire (ex: G - 52).
// Si aucun numero n'est tire, affiche un message d'attente.

import { getLetterForNumber } from '../lib/bingoLogic'

interface CurrentBallProps {
  lastDrawn: number | null  // Le dernier numero tire, ou null si aucun
}

function CurrentBall({ lastDrawn }: CurrentBallProps) {
  // Cas : aucun numero tire encore
  if (lastDrawn === null) {
    return (
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl py-3 px-6 flex items-center justify-center gap-3">
        <i className="fa-solid fa-circle-notch text-slate-500 text-2xl"></i>
        <span className="font-display text-slate-400 text-lg sm:text-xl font-semibold">
          En attente du premier tirage...
        </span>
      </div>
    )
  }

  // La lettre correspondant au numero (ex: 52 -> G)
  const letter = getLetterForNumber(lastDrawn)

  return (
    <div
      // La cle (key) force la re-animation a chaque nouveau numero
      key={lastDrawn}
      className="
        bg-gradient-to-r from-red-600 to-rose-700
        border-2 border-white/30
        rounded-2xl
        py-3 px-6
        flex items-center justify-center gap-4
        shadow-lg shadow-red-500/30
        animate-popIn
      "
    >
      {/* Icone boule */}
      <i className="fa-solid fa-circle-dot text-white/80 text-3xl sm:text-4xl"></i>

      {/* Libelle */}
      <span className="font-display text-white/80 text-base sm:text-lg font-semibold uppercase tracking-widest hidden sm:inline">
        Boule&nbsp;:
      </span>

      {/* La lettre + le numero en TRES gros */}
      <span className="font-display text-white text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none">
        {letter}
        <span className="text-white/60 mx-1">-</span>
        {lastDrawn}
      </span>
    </div>
  )
}

export default CurrentBall