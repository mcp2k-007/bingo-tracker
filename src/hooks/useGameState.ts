// ============================================
// D-IA-NE BINGO TRACKER v1.0
// Hook de gestion de l'etat de la partie
// ============================================
// Ce hook gere :
//   - La liste des numeros tires (dans l'ordre)
//   - La sauvegarde automatique dans le navigateur (localStorage)
//   - La reprise de partie apres fermeture accidentelle
//   - Le calcul de la duree de la partie (pour l'export)

import { useState, useEffect } from 'react'
import type { GameState } from '../types'

// Cle utilisee pour sauvegarder dans le navigateur
const STORAGE_KEY = 'diane-bingo-game-state'

// Etat initial : aucune partie en cours
const INITIAL_STATE: GameState = {
  drawnNumbers: [],
  startedAt: null,
}

// ============================================
// FONCTION : Charger l'etat sauvegarde au demarrage
// ============================================
function loadSavedState(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved) as GameState
    }
  } catch (error) {
    // En cas d'erreur de lecture, on repart d'une partie vierge
    console.error('Erreur de chargement de la partie sauvegardee :', error)
  }
  return INITIAL_STATE
}

// ============================================
// HOOK PRINCIPAL : useGameState
// ============================================
export function useGameState() {
  // Etat de la partie, initialise depuis la sauvegarde si elle existe
  const [gameState, setGameState] = useState<GameState>(loadSavedState)

  // ============================================
  // SAUVEGARDE AUTOMATIQUE
  // A chaque changement de l'etat, on sauvegarde dans le navigateur
  // ============================================
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState))
    } catch (error) {
      console.error('Erreur de sauvegarde de la partie :', error)
    }
  }, [gameState])

  // ============================================
  // ACTION : Activer / Desactiver un numero (toggle)
  // Clic = ajoute le numero ; re-clic = le retire
  // ============================================
  function toggleNumber(value: number) {
    setGameState((prev) => {
      const isAlreadyDrawn = prev.drawnNumbers.includes(value)

      if (isAlreadyDrawn) {
        // Retirer le numero (correction d'erreur de clic)
        return {
          ...prev,
          drawnNumbers: prev.drawnNumbers.filter((n) => n !== value),
        }
      } else {
        // Ajouter le numero a la fin de la liste (le plus recent)
        // Si c'est le premier numero, on enregistre l'heure de debut
        return {
          drawnNumbers: [...prev.drawnNumbers, value],
          startedAt: prev.startedAt ?? new Date().toISOString(),
        }
      }
    })
  }

  // ============================================
  // ACTION : Reinitialiser la partie (nouvelle partie)
  // ============================================
  function resetGame() {
    setGameState(INITIAL_STATE)
  }

  // ============================================
  // VALEURS DERIVEES (calculees a partir de l'etat)
  // ============================================

  // Nombre de numeros sortis
  const drawnCount = gameState.drawnNumbers.length

  // Nombre de numeros restants
  const remainingCount = 75 - drawnCount

  // Le dernier numero tire (le plus recent), ou null si aucun
  const lastDrawn =
    gameState.drawnNumbers.length > 0
      ? gameState.drawnNumbers[gameState.drawnNumbers.length - 1]
      : null

  // Liste des numeros tires, du plus recent au plus ancien
  // (pour le bandeau : le plus recent a gauche)
  const drawnNumbersRecentFirst = [...gameState.drawnNumbers].reverse()

  // ============================================
  // FONCTION : Calculer la duree de la partie en minutes
  // Du debut (1ere boule) jusqu'a maintenant (ou heure de fin fournie)
  // ============================================
  function getDurationMinutes(endTime?: string): number {
    if (!gameState.startedAt) return 0

    const start = new Date(gameState.startedAt).getTime()
    const end = endTime ? new Date(endTime).getTime() : Date.now()

    const diffMs = end - start
    const diffMinutes = Math.round(diffMs / 1000 / 60)

    return diffMinutes
  }

  // ============================================
  // On expose tout ce dont l'application a besoin
  // ============================================
  return {
    drawnNumbers: gameState.drawnNumbers,
    drawnNumbersRecentFirst,
    drawnCount,
    remainingCount,
    lastDrawn,
    startedAt: gameState.startedAt,
    toggleNumber,
    resetGame,
    getDurationMinutes,
  }
}