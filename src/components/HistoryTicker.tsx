// ============================================
// D-IA-NE BINGO TRACKER v1.0
// Composant : Historique des boules tirees
// ============================================
// Affiche l'historique des boules en bandeau horizontal FIXE.
//   - La plus recente est a l'extreme GAUCHE (en rouge)
//   - Chaque nouvelle boule pousse les autres vers la droite
//   - PAS d'animation automatique : les boules sont statiques
//   - L'operateur peut GLISSER au doigt pour voir les anciennes

import { getLetterForNumber } from '../lib/bingoLogic'

interface HistoryTickerProps {
  // Liste des numeros tires, du plus recent au plus ancien
  drawnNumbersRecentFirst: number[]
}

function HistoryTicker({ drawnNumbersRecentFirst }: HistoryTickerProps) {
  return (
    <div className="bg-slate-950 border-t border-slate-800 overflow-hidden">

      {/* Zone glissable horizontalement (au doigt) */}
      <div className="history-scroll overflow-x-auto py-2 px-2">

        {/* Cas : aucune boule tiree */}
        {drawnNumbersRecentFirst.length === 0 ? (
          <span className="text-slate-500 text-sm font-mono italic whitespace-nowrap">
            Aucune boule tiree pour l'instant.
          </span>
        ) : (
          <div className="flex items-center gap-2 w-max">
            {drawnNumbersRecentFirst.map((value, index) => {
              const letter = getLetterForNumber(value)
              // La premiere boule (index 0) = la plus recente : mise en valeur (rouge)
              const isMostRecent = index === 0

              return (
                <span
                  key={value}
                  className={`
                    inline-flex items-center justify-center
                    px-3 py-1
                    rounded-lg
                    font-mono font-bold text-sm sm:text-base
                    whitespace-nowrap
                    flex-shrink-0
                    ${
                      isMostRecent
                        ? 'bg-red-600 text-white border-2 border-white/40 shadow-md shadow-red-500/40'
                        : 'bg-slate-800 text-slate-200 border border-slate-700'
                    }
                  `}
                >
                  {letter}-{value}
                </span>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}

export default HistoryTicker