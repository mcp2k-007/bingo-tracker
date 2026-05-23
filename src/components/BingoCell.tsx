// ============================================
// D-IA-NE BINGO TRACKER v1.0
// Composant : Une case numerotee cliquable
// ============================================
// La case remplit toute la hauteur de sa rangee (auto-scaling).
// La taille du texte s'adapte automatiquement a l'espace disponible.

interface BingoCellProps {
  value: number
  isDrawn: boolean
  onToggle: (value: number) => void
}

function BingoCell({ value, isDrawn, onToggle }: BingoCellProps) {
  return (
    <button
      onClick={() => onToggle(value)}
      className={`
        w-full h-full min-h-0
        flex items-center justify-center
        rounded-sm sm:rounded-md
        font-bold
        border border-black sm:border-2
        transition-all duration-100
        select-none
        leading-none
        text-[clamp(0.65rem,1.8vh,1.4rem)]
        ${
          isDrawn
            ? 'bg-gray-300 text-gray-700 shadow-inner'
            : 'bg-white text-black hover:bg-gray-100 active:bg-gray-200'
        }
      `}
    >
      {value}
    </button>
  )
}

export default BingoCell