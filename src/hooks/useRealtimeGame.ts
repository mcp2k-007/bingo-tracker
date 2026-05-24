// ============================================
// D-IA/NE BINGO TRACKER v1.1
// Hook : Ecoute temps reel pour les spectateurs
// ============================================

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { GameStateRow } from '../lib/supabase'

export function useRealtimeGame() {
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([])
  const [startedAt, setStartedAt] = useState<string | null>(null)
  const [bingoActive, setBingoActive] = useState<boolean>(false)
  const [bingoStartedAt, setBingoStartedAt] = useState<string | null>(null)
  const [bingoElapsed, setBingoElapsed] = useState<number>(0)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Timer BINGO pour spectateurs
  useEffect(() => {
    if (bingoActive && bingoStartedAt) {
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
  }, [bingoActive, bingoStartedAt])

  useEffect(() => {
    async function loadInitialState() {
      try {
        const { data, error } = await supabase
          .from('game_state')
          .select('*')
          .eq('id', 'current_game')
          .single()
        if (error) {
          console.error('Erreur chargement initial :', error.message)
        } else if (data) {
          const row = data as GameStateRow
          setDrawnNumbers(row.drawn_numbers ?? [])
          setStartedAt(row.started_at)
          setBingoActive(row.bingo_active ?? false)
          setBingoStartedAt(row.bingo_started_at)
        }
      } catch (error) {
        console.error('Erreur reseau :', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadInitialState()

    const channel = supabase
      .channel('game_state_changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'game_state', filter: 'id=eq.current_game' },
        (payload) => {
          const newRow = payload.new as GameStateRow
          setDrawnNumbers(newRow.drawn_numbers ?? [])
          setStartedAt(newRow.started_at)
          setBingoActive(newRow.bingo_active ?? false)
          setBingoStartedAt(newRow.bingo_started_at)
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setIsConnected(true)
        else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') setIsConnected(false)
      })

    return () => { supabase.removeChannel(channel) }
  }, [])

  const drawnCount = drawnNumbers.length
  const remainingCount = 75 - drawnCount
  const lastDrawn = drawnCount > 0 ? drawnNumbers[drawnCount - 1] : null
  const drawnNumbersRecentFirst = [...drawnNumbers].reverse()

  function formatBingoTimer(seconds: number): string {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}m${String(s).padStart(2, '0')}sec`
  }

  return {
    drawnNumbers, drawnNumbersRecentFirst, drawnCount, remainingCount,
    lastDrawn, startedAt, bingoActive, bingoElapsed,
    isConnected, isLoading, formatBingoTimer,
  }
}