// ============================================
// D-IA-NE BINGO TRACKER v1.0
// Composant : La grille complete de bingo
// ============================================
// Affiche les 5 colonnes B-I-N-G-O sur fond bleu ciel.
// AUTO-SCALING : les 15 rangees se repartissent egalement
// dans la hauteur disponible, donc les 75 numeros tiennent
// TOUJOURS a l'ecran sans avoir besoin de scroller.

import { COLUMNS, getNumbersForColumn } from '../lib/bingoLogic'
import BingoCell from './BingoCell'

// Proprietes recues du parent (App.tsx)
interface BingoBoardProps {
  drawnNumbers: number[]              // Liste des numeros tires
  onToggleNumber: (value: number) => void  // Fonction appelee au clic d'un numero
}

function BingoBoard({ drawnNumbers, onToggleNumber }: BingoBoardProps) {
  // Les 15 numeros de chaque colonne, pre-calcules
  const numbersByColumn = COLUMNS.map((column) => ({
    letter: column.letter,
    numbers: getNumbersForColumn(column.letter),
  }))

  return (
    // Carte de bingo : fond bleu ciel, occupe tout l'espace dispo (hauteur incluse)
    <div className="bg-sky-200 rounded-2xl p-1.5 sm:p-2 shadow-2xl border-4 border-sky-300 h-full flex flex-col overflow-hidden">

      {/* En-tete : les 5 lettres B-I-N-G-O */}
      <div className="grid grid-cols-5 gap-1 sm:gap-1.5 flex-shrink-0 mb-1 sm:mb-1.5">
        {COLUMNS.map((column) => (
          <div
            key={column.letter}
            className="
              text-center
              py-1
              rounded-lg
              font-extrabold
              text-xl sm:text-2xl lg:text-3xl
              tracking-wider
              bg-blue-700 text-white
              shadow-md
              select-none
              leading-tight
            "
          >
            {column.letter}
          </div>
        ))}
      </div>

      {/* ============================================
          ZONE DES NUMEROS (auto-scaling)
          grid-rows-15 : 15 rangees de hauteur egale
          flex-grow : occupe toute la hauteur restante
          Chaque case se redimensionne automatiquement.
          ============================================ */}
      <div
        className="grid grid-cols-5 gap-1 sm:gap-1.5 flex-grow"
        style={{ gridTemplateRows: 'repeat(15, minmax(0, 1fr))' }}
      >
        {/* On parcourt rangee par rangee (0 a 14) pour aligner les numeros */}
        {Array.from({ length: 15 }).map((_, rowIndex) =>
          numbersByColumn.map((column) => {
            const value = column.numbers[rowIndex]
            return (
              <BingoCell
                key={value}
                value={value}
                isDrawn={drawnNumbers.includes(value)}
                onToggle={onToggleNumber}
              />
            )
          })
        )}
      </div>
    </div>
  )
}

export default BingoBoard