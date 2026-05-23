// ============================================
// D-IA/NE BINGO TRACKER v1.1
// Composant principal de l'application
// ============================================
// Auteur : Paskal (pour Diane Brochu)
// Phase 2 : Interface optimisee (espace maximise pour la grille)

import { useState } from 'react'
import { useGameState } from './hooks/useGameState'
import type { SavedGame } from './lib/exportGame'
import BingoBoard from './components/BingoBoard'
import CurrentBall from './components/CurrentBall'
import HistoryTicker from './components/HistoryTicker'
import SaveGameModal from './components/SaveGameModal'

function App() {
  // Le "cerveau" de la partie (etat + sauvegarde auto)
  const {
    drawnNumbers,
    drawnNumbersRecentFirst,
    drawnCount,
    remainingCount,
    lastDrawn,
    startedAt,
    toggleNumber,
    resetGame,
    getDurationMinutes,
  } = useGameState()

  // Etat du verrou "BINGO" (grille figee quand true)
  const [isLocked, setIsLocked] = useState<boolean>(false)

  // Etat de la modale de sauvegarde (null = fermee)
  const [gameToSave, setGameToSave] = useState<SavedGame | null>(null)

  // Bascule le verrou BINGO
  function toggleBingoLock() {
    setIsLocked((prev) => !prev)
  }

  // Clic sur un numero : ignore si la grille est verrouillee
  function handleToggleNumber(value: number) {
    if (isLocked) return
    toggleNumber(value)
  }

  // Gestion du clic sur "Nouvelle partie" avec confirmation
  function handleNewGame() {
    if (isLocked) {
      window.alert('La grille est verrouillee (BINGO actif). Declenche le verrou pour commencer une nouvelle partie.')
      return
    }
    if (drawnCount > 0) {
      const confirmed = window.confirm(
        'Es-tu sure de vouloir effacer le tirage en cours et commencer une nouvelle partie ?'
      )
      if (!confirmed) return
    }
    resetGame()
  }

  // Terminer et sauvegarder la partie (ouvre la modale)
  function handleSaveGame() {
    if (drawnCount === 0) {
      window.alert('Aucune boule n\'a ete tiree. Il n\'y a rien a sauvegarder pour le moment.')
      return
    }

    const now = new Date()
    const heures = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const defaultName = `Bingo_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${heures}h${minutes}`

    const chosenName = window.prompt(
      'Quel nom veux-tu donner a ce bingo ?\n(Tu peux garder le nom propose ou taper le tien)',
      defaultName
    )

    if (chosenName === null) return

    const finalName = chosenName.trim() === '' ? defaultName : chosenName.trim()

    const endedAt = new Date().toISOString()
    const savedGame: SavedGame = {
      name: finalName,
      startedAt: startedAt,
      endedAt: endedAt,
      durationMinutes: getDurationMinutes(endedAt),
      drawnNumbers: drawnNumbers,
      totalDrawn: drawnCount,
    }

    setGameToSave(savedGame)
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden">

      {/* ============================================
          HEADER COMPACT : Titre + Compteurs + Boutons fenetre
          (les compteurs sont maintenant integres ici)
          ============================================ */}
      <header className="bg-slate-900 border-b border-slate-800 flex justify-between items-center px-3 py-2 select-none flex-shrink-0 gap-3">

        {/* Gauche : Logo + Titre */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <i className="fa-solid fa-table-cells text-red-500"></i>
          <h1 className="font-display text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
            D-IA/NE BINGO Tracker
            <span className="text-xs text-red-500 font-normal bg-red-500/10 px-2 py-0.5 rounded-full ml-2">
              v1.1
            </span>
          </h1>
        </div>

        {/* Centre/Droite : Compteurs */}
        <div className="flex gap-4 sm:gap-6 items-center ml-auto">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider hidden md:inline">Sortis</span>
            <span className="text-xl sm:text-2xl font-extrabold text-red-500 leading-none">{drawnCount}</span>
          </div>
          <div className="w-px h-5 bg-slate-700"></div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider hidden md:inline">Restants</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-200 leading-none">{remainingCount}</span>
          </div>
        </div>

        {/* Boutons de fenetre (decoratifs) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="w-3.5 h-3.5 rounded-full bg-yellow-500 border border-yellow-600" title="Reduire" />
          <button className="w-3.5 h-3.5 rounded-full bg-green-500 border border-green-600" title="Agrandir" />
          <button className="w-3.5 h-3.5 rounded-full bg-red-500 border border-red-600" title="Fermer" />
        </div>
      </header>

      {/* ============================================
          BARRE D'ACTION UNIQUE (tout sur une ligne)
          Boutons compacts + Boule en cours + Bouton BINGO
          ============================================ */}
      <div className="flex-shrink-0 px-3 py-2 flex items-center gap-2 sm:gap-3">

        {/* Bouton Nouvelle partie (compact, icone seule + texte au survol sur grand ecran) */}
        <button
          onClick={handleNewGame}
          className="flex-shrink-0 px-3 py-3 bg-slate-700 hover:bg-slate-600 active:scale-95 rounded-xl transition font-semibold flex items-center gap-2"
          title="Nouvelle partie"
        >
          <i className="fa-solid fa-rotate-left text-lg"></i>
          <span className="hidden lg:inline text-sm">Nouvelle</span>
        </button>

        {/* Bouton Sauvegarder (compact) */}
        <button
          onClick={handleSaveGame}
          className="flex-shrink-0 px-3 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 rounded-xl transition font-semibold flex items-center gap-2 shadow-md shadow-emerald-500/20"
          title="Terminer et sauvegarder"
        >
          <i className="fa-solid fa-floppy-disk text-lg"></i>
          <span className="hidden lg:inline text-sm">Sauver</span>
        </button>

        {/* Boule en cours (largeur fixe) */}
        <CurrentBall lastDrawn={lastDrawn} />

        {/* Espaceur flexible : pousse le bouton BINGO a l'extreme droite */}
        <div className="flex-grow"></div>

        {/* Bouton BINGO (extreme droite) */}
        <button
          onClick={toggleBingoLock}
          className={`
            flex-shrink-0
            font-display font-extrabold
            rounded-2xl
            border-4 border-white
            transition-all duration-200
            select-none
            uppercase tracking-wider
            ${
              isLocked
                ? 'bg-red-600 text-white scale-105 shadow-xl shadow-red-500/50 px-8 py-2 text-2xl sm:text-3xl ring-4 ring-red-400/40'
                : 'bg-red-500/80 hover:bg-red-500 text-white px-6 py-2 text-xl sm:text-2xl active:scale-95'
            }
          `}
          title={isLocked ? 'Cliquer pour deverrouiller la grille' : 'Cliquer pour verrouiller la grille (BINGO !)'}
        >
          {isLocked ? (
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-lock"></i>
              BINGO
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-trophy"></i>
              BINGO
            </span>
          )}
        </button>
      </div>

      {/* ZONE PRINCIPALE : LA GRILLE DE BINGO (plus grande maintenant !) */}
      <main className="flex-grow overflow-hidden px-2 sm:px-3 pb-2 flex flex-col relative">
        {isLocked && (
          <div className="absolute top-1 left-1/2 -translate-x-1/2 z-20 bg-red-600 text-white text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-lg border border-white/40 flex items-center gap-2 animate-popIn">
            <i className="fa-solid fa-lock"></i>
            GRILLE VERROUILLEE — Verification BINGO en cours
          </div>
        )}

        <div className={`flex-grow flex flex-col transition-all duration-200 ${isLocked ? 'opacity-90 saturate-150' : ''}`}>
          <BingoBoard
            drawnNumbers={drawnNumbers}
            onToggleNumber={handleToggleNumber}
          />
        </div>
      </main>

      {/* BANDEAU HISTORIQUE (glissable au doigt) */}