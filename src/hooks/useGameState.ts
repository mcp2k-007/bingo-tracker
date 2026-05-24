// ============================================
// D-IA/NE BINGO TRACKER v1.1
// Hook de gestion de l'etat de la partie
// ============================================
// Ce hook gere :
//   - L'etat local de la partie (React state)
//   - La sauvegarde locale (localStorage)
//   - La SYNCHRONISATION TEMPS REEL avec Supabase
//   - Chaque clic de Diane → Supabase → spectateurs

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { GameState } from '../types'

// Cle localStorage pour la reprise apres fermeture
const STORAGE_KEY = 'diane-bingo-game-state'

// Etat initial : aucune partie en cours
const INITIAL_STATE: GameState = {
  drawnNumbers: [],
  startedAt: null,
}

// ============================================
// FONCTION : Charger l'etat sauvegarde localement
// ============================================
function loadSavedState(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved) as GameState
    }
  } catch (error) {
    console.error('Erreur chargement localStorage :', error)
  }
  return INITIAL_STATE
}

// ============================================
// HOOK PRINCIPAL : useGameState
// ============================================
export function useGameState() {
  // Etat local React (affichage immediat)
  const [gameState, setGameState] = useState<GameState>(loadSavedState)

  // ============================================
  // SAUVEGARDE LOCALE AUTOMATIQUE (localStorage)
  // A chaque changement → sauvegarde dans le navigateur
  // ============================================
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState))
    } catch (error) {
      console.error('Erreur sauvegarde localStorage :', error)
    }
  }, [gameState])

  // ============================================
  // SYNCHRONISATION SUPABASE
  // A chaque changement de l'etat → mise a jour dans Supabase
  // Supabase diffuse ensuite aux spectateurs via WebSocket
  // ============================================
  const syncToSupabase = useCallback(async (state: GameState) => {
    try {
      const { error } = await supabase
        .from('game_state')
        .update({
          drawn_numbers: state.drawnNumbers,
          started_at: state.startedAt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 'current_game')

      if (error) {
        console.error('Erreur sync Supabase :', error.message)
      }
    } catch (error) {
      console.error('Erreur reseau Supabase :', error)
    }
  }, [])

  // ============================================
  // ACTION : Activer / Desactiver un numero (toggle)
  // ============================================
  function toggleNumber(value: number) {
    setGameState((prev) => {
      const isAlreadyDrawn = prev.drawnNumbers.includes(value)
      let newState: GameState

      if (isAlreadyDrawn) {
        // Retirer le numero
        newState = {
          ...prev,
          drawnNumbers: prev.drawnNumbers.filter((n) => n !== value),
        }
      } else {
        // Ajouter le numero
        newState = {
          drawnNumbers: [...prev.drawnNumbers, value],
          startedAt: prev.startedAt ?? new Date().toISOString(),
        }
      }

      // Sync Supabase en arriere-plan (sans bloquer l'UI)
      syncToSupabase(newState)
      return newState
    })
  }

  // ============================================
  // ACTION : Reinitialiser la partie
  // ============================================
  function resetGame() {
    const newState = INITIAL_STATE
    setGameState(newState)
    syncToSupabase(newState)
  }

  // ============================================
  // VALEURS DERIVEES
  // ============================================
  const drawnCount = gameState.drawnNumbers.length
  const remainingCount = 75 - drawnCount
  const lastDrawn = gameState.drawnNumbers.length > 0
    ? gameState.drawnNumbers[gameState.drawnNumbers.length - 1]
    : null
  const drawnNumbersRecentFirst = [...gameState.drawnNumbers].reverse()

  // ============================================
  // FONCTION : Calculer la duree de la partie
  // ============================================
  function getDurationMinutes(endTime?: string): number {
    if (!gameState.startedAt) return 0
    const start = new Date(gameState.startedAt).getTime()
    const end = endTime ? new Date(endTime).getTime() : Date.now()
    return Math.round((end - start) / 1000 / 60)
  }

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