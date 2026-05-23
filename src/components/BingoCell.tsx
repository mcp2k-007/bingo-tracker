// ============================================
// D-IA-NE BINGO TRACKER v1.0
// Composant : Une case numerotee cliquable
// ============================================
// Affiche un seul numero de bingo.
//   - Etat normal  : fond blanc, texte noir, bordure noire
//   - Etat sorti   : fond gris pale (numero tire)
// La case remplit toute la hauteur de sa rangee (auto-scaling).

// Proprietes que ce composant recoit de son parent
interface BingoCellProps {
  value: number              // Le numero a afficher (ex: 52)
  isDrawn: boolean           // Est-ce que ce numero est sorti ?
  onToggle: (value: number) => void  // Fonction appelee au clic
}

function BingoCell({ value, isDrawn, onToggle }: BingoCellProps) {
  return (
    <button
      onClick={() => onToggle(value)}
      className={`
        w-full h-full
        flex items-center justify-center
        rounded-md
        font-bold
        border-2 border-black
        transition-all duration-100
        select-none
        leading-none
        text-[clamp(0.75rem,2.8vw,1.5rem)]
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