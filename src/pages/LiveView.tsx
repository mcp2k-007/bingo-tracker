// ============================================
// D-IA/NE BINGO TRACKER v1.1
// Page : Vue Spectateur (/live)
// ============================================
// Page publique en LECTURE SEULE.
// Les spectateurs voient la grille de Diane en direct.
// Aucun bouton cliquable (pas de manipulation possible).
// Inclut l'espace publicitaire (AdBanner) en haut.

import { useRealtimeGame } from '../hooks/useRealtimeGame'
import { getLetterForNumber, COLUMNS, getNumbersForColumn } from '../lib/bingoLogic'
import AdBanner from '../components/AdBanner'

function LiveView() {
  const {
    drawnNumbers,
    drawnNumbersRecentFirst,
    drawnCount,
    remainingCount,
    lastDrawn,
    isConnected,
    isLoading,
  } = useRealtimeGame()

  // ============================================
  // ECRAN DE CHARGEMENT
  // ============================================
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <i className="fa-solid fa-circle-notch fa-spin text-red-500 text-4xl mb-4"></i>
          <p className="text-slate-300 font-display text-xl">
            Connexion au serveur...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden">

      {/* ============================================
          HEADER : Titre + Indicateur EN DIRECT
          ============================================ */}
      <header className="bg-slate-900 border-b border-slate-800 flex justify-between items-center px-3 py-2 select-none flex-shrink-0">

        {/* Gauche : Logo + Titre */}
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-table-cells text-red-500"></i>
          <h1 className="font-display text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
            D-IA/NE BINGO Tracker
            <span className="text-xs text-red-500 font-normal bg-red-500/10 px-2 py-0.5 rounded-full ml-2">
              v1.1
            </span>
          </h1>
        </div>

        {/* Droite : Indicateur EN DIRECT */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            isConnected
              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
              : 'bg-slate-700 text-slate-400 border border-slate-600'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-red-500 animate-pulse' : 'bg-slate-500'
            }`}></span>
            {isConnected ? 'EN DIRECT' : 'Connexion...'}
          </div>

          {/* Compteurs */}
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold text-red-500">{drawnCount}</span>
            <div className="w-px h-5 bg-slate-700"></div>
            <span className="text-xl font-extrabold text-slate-200">{remainingCount}</span>
          </div>
        </div>
      </header>

      {/* ============================================
          ADBANNER : Espace publicitaire (haut de page)
          ============================================ */}
      <div className="flex-shrink-0 px-3 pt-2">
        <AdBanner />
      </div>

      {/* ============================================
          BOULE EN COURS (lecture seule)
          ============================================ */}
      <div className="flex-shrink-0 px-3 py-2">
        {lastDrawn === null ? (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl py-2 px-4 flex items-center justify-center gap-3">
            <i className="fa-solid fa-circle-notch text-slate-500 text-xl"></i>
            <span className="font-display text-slate-400 text-base font-semibold">
              En attente du premier tirage...
            </span>
          </div>
        ) : (
          <div className="
            bg-gradient-to-r from-red-600 to-rose-700
            border-4 border-white
            rounded-2xl px-6 py-2
            flex items-center justify-center gap-3
            shadow-lg shadow-red-500/30
          ">
            <i className="fa-solid fa-circle-dot text-white/80 text-xl sm:text-2xl"></i>
            <span className="font-display text-white/80 text-lg font-semibold uppercase tracking-wider">
              Boule&nbsp;:
            </span>
            <span className="font-display text-white text-xl sm:text-2xl font-extrabold tracking-wider">
              {getLetterForNumber(lastDrawn)} - {lastDrawn}
            </span>
          </div>
        )}
      </div>

      {/* ============================================
          GRILLE BINGO (LECTURE SEULE - aucun clic)
          ============================================ */}
      <main className="flex-grow overflow-hidden px-2 sm:px-3 pb-2 flex flex-col">
        <div className="bg-sky-200 rounded-2xl p-1.5 sm:p-2 shadow-2xl border-4 border-sky-300 h-full flex flex-col overflow-hidden">

          {/* En-tete B-I-N-G-O */}
          <div className="grid grid-cols-5 gap-1 sm:gap-1.5 flex-shrink-0 mb-1 sm:mb-1.5">
            {COLUMNS.map((column) => (
              <div
                key={column.letter}
                className="text-center py-0.5 sm:py-1 rounded-lg font-extrabold text-lg sm:text-xl lg:text-2xl tracking-wider bg-blue-700 text-white shadow-md select-none leading-tight"
              >
                {column.letter}
              </div>
            ))}
          </div>

          {/* Numeros (lecture seule, cursor auto) */}
          <div
            className="grid grid-cols-5 gap-[2px] sm:gap-1 flex-grow min-h-0"
            style={{ gridTemplateRows: 'repeat(15, minmax(0, 1fr))' }}
          >
            {Array.from({ length: 15 }).map((_, rowIndex) =>
              COLUMNS.map((column) => {
                const numbers = getNumbersForColumn(column.letter)
                const value = numbers[rowIndex]
                const isDrawn = drawnNumbers.includes(value)

                return (
                  <div
                    key={value}
                    className={`
                      w-full h-full
                      flex items-center justify-center
                      rounded-sm sm:rounded-md
                      font-bold
                      border border-black sm:border-2
                      leading-none
                      text-[clamp(0.65rem,1.8vh,1.4rem)]
                      select-none
                      cursor-default
                      ${isDrawn
                        ? 'bg-gray-300 text-gray-700 shadow-inner'
                        : 'bg-white text-black'
                      }
                    `}
                  >
                    {value}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>

      {/* ============================================
          HISTORIQUE (lecture seule, glissable)
          ============================================ */}
      <div className="bg-slate-950 border-t border-slate-800 overflow-hidden flex-shrink-0">
        <div className="history-scroll overflow-x-auto py-2 px-2">
          {drawnNumbersRecentFirst.length === 0 ? (
            <span className="text-slate-500 text-sm font-mono italic whitespace-nowrap">
              Aucune boule tiree pour l'instant.
            </span>
          ) : (
            <div className="flex items-center gap-2 w-max">
              {drawnNumbersRecentFirst.map((value, index) => (
                <span
                  key={value}
                  className={`
                    inline-flex items-center justify-center
                    px-3 py-1 rounded-lg
                    font-mono font-bold text-sm sm:text-base
                    whitespace-nowrap flex-shrink-0
                    ${index === 0
                      ? 'bg-red-600 text-white border-2 border-white/40 shadow-md'
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                    }
                  `}
                >
                  {getLetterForNumber(value)}-{value}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PIED DE PAGE */}
      <footer className="bg-slate-900 border-t border-slate-800 py-1.5 px-3 flex-shrink-0">
        <p className="text-center text-xs text-slate-500 font-mono tracking-wide">
          Fabrique et opere par{' '}
          <span className="text-slate-300 font-bold">Diane Brochu &copy; 2026</span>
        </p>
      </footer>
    </div>
  )
}

export default LiveView