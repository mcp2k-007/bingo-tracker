// ============================================
// D-IA-NE Bingo Tracker v1.2
// Composant : La grille complete de bingo
// ============================================
// AUTO-SCALING RESPONSIVE : les 15 rangees se repartissent
// egalement dans la hauteur disponible, donc les 75 numeros
// tiennent TOUJOURS a l'ecran sans scroller.
// Fonctionne en portrait (iPad) ET paysage (PC wide screen).

import { COLUMNS, getNumbersForColumn } from '../lib/bingoLogic'
import BingoCell from './BingoCell'

// Proprietes recues du parent (App.tsx)
interface BingoBoardProps {
  drawnNumbers: number[]
  onToggleNumber: (value: number) => void
}

function BingoBoard({ drawnNumbers, onToggleNumber }: BingoBoardProps) {
  // Les 15 numeros de chaque colonne, pre-calcules
  const numbersByColumn = COLUMNS.map((column) => ({
    letter: column.letter,
    numbers: getNumbersForColumn(column.letter),
  }))

  return (
    // Carte de bingo : fond bleu ciel, hauteur 100% du parent
    <div className="bg-sky-200 rounded-2xl p-1.5 sm:p-2 shadow-2xl border-4 border-sky-300 h-full flex flex-col overflow-hidden">
      {/* En-tete B-I-N-G-O encadre d'un contour NOIR gras (demande #1).
          Style IDENTIQUE a LiveView.tsx : meme border, meme rayon, meme padding. */}
      <div className="flex-shrink-0 mb-1 sm:mb-1.5 rounded-xl border-2 sm:border-[3px] border-black p-1">
        <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
          {COLUMNS.map((column) => (
            <div
              key={column.letter}
              className="
                text-center
                py-0.5 sm:py-1
                rounded-lg
                font-extrabold
                text-lg sm:text-xl lg:text-2xl
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
      </div>

      {/* Zone des numeros (auto-scaling via CSS grid + hauteur calculee) */}
      <div
        className="grid grid-cols-5 gap-[2px] sm:gap-1 flex-grow min-h-0"
        style={{
          gridTemplateRows: 'repeat(15, minmax(0, 1fr))',
        }}
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
