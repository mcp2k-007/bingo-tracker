// ============================================
// D-IA/NE BINGO TRACKER v1.2
// Page : Vue Spectateur (/live) - Lecture seule
// ============================================

import { useRealtimeGame } from '../hooks/useRealtimeGame'
import { getLetterForNumber, COLUMNS, getNumbersForColumn } from '../lib/bingoLogic'
import AdCarousel from '../components/AdCarousel'
import Footer from '../components/Footer'
import TerminalClock from '../components/TerminalClock'

function LiveView() {
  const {
    drawnNumbers, drawnNumbersRecentFirst, drawnCount, remainingCount,
    lastDrawn, bingoActive, bingoElapsed, isConnected, isLoading, formatBingoTimer,
  } = useRealtimeGame()

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <i className="fa-solid fa-circle-notch fa-spin text-red-500 text-4xl mb-4"></i>
          <p className="text-slate-300 font-display text-xl">Connexion au serveur...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden">
      <header className="bg-slate-900 border-b border-slate-800 flex justify-between items-center px-3 py-2 select-none flex-shrink-0">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-table-cells text-red-500"></i>
          <h1 className="font-display text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">D&bull;IA&bull;NE BINGO Tracker <span className="text-xs text-red-500 font-normal bg-red-500/10 px-2 py-0.5 rounded-full ml-2">v1.2</span></h1>
        </div>
        <div className="flex items-center gap-3">
          {/* BOULE EN COURS (principale) - a GAUCHE de l'horloge. Identique a la
              replique de l'historique : rouge foncE, typo blanche grasse, flash moyen. */}
          <div className="ball-waiting flex items-center justify-center px-3 py-1 rounded-lg font-mono font-bold text-sm sm:text-base bg-red-700 text-white border-2 border-white/40 shadow-md whitespace-nowrap leading-none">
            {lastDrawn !== null ? `${getLetterForNumber(lastDrawn)}-${lastDrawn}` : '--'}
          </div>
          {/* Horloge style terminal, a GAUCHE du bouton "EN DIRECT" (sans cadre) */}
          <TerminalClock className="text-red-400 text-sm sm:text-base" />
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isConnected ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-slate-700 text-slate-400 border border-slate-600'}`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></span>
            {isConnected ? 'EN DIRECT' : 'Connexion...'}
          </div>
          <span className="text-xl font-extrabold text-red-500">{drawnCount}</span>
          <div className="w-px h-5 bg-slate-700"></div>
          <span className="text-xl font-extrabold text-slate-200">{remainingCount}</span>
        </div>
      </header>

      <div className="flex-shrink-0 px-3 pt-2">
        <AdCarousel />
      </div>

      {/* BANNIERE VERIFICATION BINGO (visible quand Diane appuie BINGO) */}
      {bingoActive && (
        <div className="flex-shrink-0 px-3 pt-2">
          <div className="bg-red-600 border-2 border-white/40 rounded-xl px-4 py-3 text-center shadow-lg animate-pulse">
            <div className="flex items-center justify-center gap-3 mb-1">
              <i className="fa-solid fa-hand text-white text-xl"></i>
              <span className="font-display text-white font-extrabold text-lg sm:text-xl uppercase tracking-wider">Verification BINGO</span>
              <i className="fa-solid fa-hand text-white text-xl"></i>
            </div>
            <p className="text-white/90 text-sm sm:text-base font-semibold">Ne bougez pas vos cartes, on verifie un Bingo au telephone avec un participant presentement, merci de votre patience !!!</p>
            <div className="mt-2 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1">
              <i className="fa-solid fa-stopwatch text-white"></i>
              <span className="font-display text-white font-extrabold text-lg">{formatBingoTimer(bingoElapsed)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Boule en cours retiree en v1.2 : la boule courante est la plus recente
          de l'historique (en bas), qui pulse doucement (voir plus bas). */}

      {/* Grille BINGO (lecture seule) */}
      <main className="flex-grow overflow-hidden px-2 sm:px-3 pb-2 flex flex-col">
        <div className="bg-sky-200 rounded-2xl p-1.5 sm:p-2 shadow-2xl border-4 border-sky-300 h-full flex flex-col overflow-hidden">
          <div className="grid grid-cols-5 gap-1 sm:gap-1.5 flex-shrink-0 mb-1 sm:mb-1.5">
            {COLUMNS.map((column) => (<div key={column.letter} className="text-center py-0.5 sm:py-1 rounded-lg font-extrabold text-lg sm:text-xl lg:text-2xl tracking-wider bg-blue-700 text-white shadow-md select-none leading-tight">{column.letter}</div>))}
          </div>
          <div className="grid grid-cols-5 gap-[2px] sm:gap-1 flex-grow min-h-0" style={{ gridTemplateRows: 'repeat(15, minmax(0, 1fr))' }}>
            {Array.from({ length: 15 }).map((_, rowIndex) => COLUMNS.map((column) => {
              const numbers = getNumbersForColumn(column.letter)
              const value = numbers[rowIndex]
              const isDrawn = drawnNumbers.includes(value)
              return (<div key={value} className={`w-full h-full flex items-center justify-center rounded-sm sm:rounded-md font-bold border border-black sm:border-2 leading-none text-[clamp(0.65rem,1.8vh,1.4rem)] select-none cursor-default ${isDrawn ? 'bg-blue-700 text-white shadow-inner' : 'bg-white text-black'}`}>{value}</div>)
            }))}
          </div>
        </div>
      </main>

      {/* Historique */}
      <div className="bg-slate-950 border-t border-slate-800 overflow-hidden flex-shrink-0">
        <div className="overflow-x-auto py-2 px-2">
          {drawnNumbersRecentFirst.length === 0 ? (
            <span className="text-slate-500 text-sm font-mono italic whitespace-nowrap">Aucune boule tiree pour l'instant.</span>
          ) : (
            <div className="flex items-center gap-2 w-max">
              {drawnNumbersRecentFirst.map((value, index) => (<span key={value} className={`inline-flex items-center justify-center px-3 py-1 rounded-lg font-mono font-bold text-sm sm:text-base whitespace-nowrap flex-shrink-0 ${index === 0 ? 'ball-waiting bg-red-700 text-white border-2 border-white/40 shadow-md' : 'bg-slate-800 text-slate-200 border border-slate-700'}`}>{getLetterForNumber(value)}-{value}</span>))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default LiveView
