// ============================================
// D-IA/NE BINGO TRACKER v1.1
// Hook de gestion de l'etat de la partie
// ============================================
// Gere : etat local, sauvegarde localStorage, sync Supabase,
// verrou BINGO avec timer, enregistrement des verifications BINGO.

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { GameState, BingoCheck } from '../types'

const STORAGE_KEY = 'diane-bingo-game-state'
const BINGO_CHECKS_KEY = 'diane-bingo-checks'

const INITIAL_STATE: GameState = {
  drawnNumbers: [],
  startedAt: null,
}

function loadSavedState(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved) as GameState
  } catch (error) {
    console.error('Erreur chargement localStorage :', error)
  }
  return INITIAL_STATE
}

function loadBingoChecks(): BingoCheck[] {
  try {
    const saved = localStorage.getItem(BINGO_CHECKS_KEY)
    if (saved) return JSON.parse(saved) as BingoCheck[]
  } catch (error) {
    console.error('Erreur chargement bingo checks :', error)
  }
  return []
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(loadSavedState)
  const [isLocked, setIsLocked] = useState<boolean>(false)
  const [bingoStartedAt, setBingoStartedAt] = useState<string | null>(null)
  const [bingoElapsed, setBingoElapsed] = useState<number>(0)
  const [bingoChecks, setBingoChecks] = useState<BingoCheck[]>(loadBingoChecks)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Sauvegarde locale automatique
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState))
    } catch (error) {
      console.error('Erreur sauvegarde localStorage :', error)
    }
  }, [gameState])

  // Sauvegarde des bingo checks
  useEffect(() => {
    try {
      localStorage.setItem(BINGO_CHECKS_KEY, JSON.stringify(bingoChecks))
    } catch (error) {
      console.error('Erreur sauvegarde bingo checks :', error)
    }
  }, [bingoChecks])

  // Timer BINGO (compte les secondes)
  useEffect(() => {
    if (isLocked && bingoStartedAt) {
      timerRef.current = setInterval(() => {
        const start = new Date(bingoStartedAt).getTime()
        const now = Date.now()
        setBingoElapsed(Math.floor((now - start) / 1000))
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      setBingoElapsed(0)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isLocked, bingoStartedAt])

  // Sync Supabase (numeros + etat BINGO)
  const syncToSupabase = useCallback(async (
    state: GameState,
    bingoActive: boolean,
    bingoStart: string | null
  ) => {
    try {
      const { error } = await supabase
        .from('game_state')
        .update({
          drawn_numbers: state.drawnNumbers,
          started_at: state.startedAt,
          updated_at: new Date().toISOString(),
          bingo_active: bingoActive,
          bingo_started_at: bingoStart,
        })
        .eq('id', 'current_game')
      if (error) console.error('Erreur sync Supabase :', error.message)
    } catch (error) {
      console.error('Erreur reseau Supabase :', error)
    }
  }, [])

  // ACTION : Activer/Desactiver BINGO
  function toggleBingoLock() {
    if (!isLocked) {
      // ACTIVER BINGO → demarrer le timer
      const startTime = new Date().toISOString()
      setIsLocked(true)
      setBingoStartedAt(startTime)
      syncToSupabase(gameState, true, startTime)
    } else {
      // DESACTIVER BINGO → arreter le timer + enregistrer
      const endTime = new Date().toISOString()
      if (bingoStartedAt) {
        const start = new Date(bingoStartedAt).getTime()
        const end = new Date(endTime).getTime()
        const durationSeconds = Math.floor((end - start) / 1000)
        const newCheck: BingoCheck = {
          startTime: bingoStartedAt,
          endTime: endTime,
          durationSeconds: durationSeconds,
        }
        setBingoChecks((prev) => [...prev, newCheck])
      }
      setIsLocked(false)
      setBingoStartedAt(null)
      syncToSupabase(gameState, false, null)
    }
  }

  // ACTION : Toggle un numero
  function toggleNumber(value: number) {
    if (isLocked) return
    setGameState((prev) => {
      const isAlreadyDrawn = prev.drawnNumbers.includes(value)
      let newState: GameState
      if (isAlreadyDrawn) {
        newState = { ...prev, drawnNumbers: prev.drawnNumbers.filter((n) => n !== value) }
      } else {
        newState = {
          drawnNumbers: [...prev.drawnNumbers, value],
          startedAt: prev.startedAt ?? new Date().toISOString(),
        }
      }
      syncToSupabase(newState, isLocked, bingoStartedAt)
      return newState
    })
  }

  // ACTION : Reinitialiser
  function resetGame() {
    if (isLocked) return
    const newState = INITIAL_STATE
    setGameState(newState)
    setBingoChecks([])
    syncToSupabase(newState, false, null)
  }

  // Valeurs derivees
  const drawnCount = gameState.drawnNumbers.length
  const remainingCount = 75 - drawnCount
  const lastDrawn = drawnCount > 0 ? gameState.drawnNumbers[drawnCount - 1] : null
  const drawnNumbersRecentFirst = [...gameState.drawnNumbers].reverse()

  function getDurationMinutes(endTime?: string): number {
    if (!gameState.startedAt) return 0
    const start = new Date(gameState.startedAt).getTime()
    const end = endTime ? new Date(endTime).getTime() : Date.now()
    return Math.round((end - start) / 1000 / 60)
  }

  // Formater le timer : "1m17sec"
  function formatBingoTimer(seconds: number): string {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}m${String(s).padStart(2, '0')}sec`
  }

  return {
    drawnNumbers: gameState.drawnNumbers,
    drawnNumbersRecentFirst,
    drawnCount,
    remainingCount,
    lastDrawn,
    startedAt: gameState.startedAt,
    isLocked,
    bingoElapsed,
    bingoChecks,
    toggleNumber,
    toggleBingoLock,
    resetGame,
    getDurationMinutes,
    formatBingoTimer,
  }
}