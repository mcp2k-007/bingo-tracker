// ============================================
// D-IA/NE BINGO TRACKER v1.1
// Hook : Ecoute temps reel pour les spectateurs
// ============================================
// Ce hook s'abonne aux changements de game_state
// via Supabase Realtime (WebSocket).
// Chaque clic de Diane → spectateurs voient en direct.

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { GameStateRow } from '../lib/supabase'

export function useRealtimeGame() {
  // Etat : numeros tires (mis a jour en temps reel)
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([])
  const [startedAt, setStartedAt] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // ============================================
    // 1. CHARGEMENT INITIAL
    // Charge l'etat actuel de la partie au demarrage
    // ============================================
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
        }
      } catch (error) {
        console.error('Erreur reseau :', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialState()

    // ============================================
    // 2. ABONNEMENT TEMPS REEL (WebSocket)
    // Ecoute chaque mise a jour de game_state
    // ============================================
    const channel = supabase
      .channel('game_state_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_state',
          filter: 'id=eq.current_game',
        },
        (payload) => {
          // Une mise a jour a ete detectee !
          const newRow = payload.new as GameStateRow
          setDrawnNumbers(newRow.drawn_numbers ?? [])
          setStartedAt(newRow.started_at)
        }
      )
      .subscribe((status) => {
        // Statut de la connexion WebSocket
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setIsConnected(false)
        }
      })

    // ============================================
    // 3. NETTOYAGE
    // Deconnexion quand le composant est demonte
    // ============================================
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Valeurs derivees
  const drawnCount = drawnNumbers.length
  const remainingCount = 75 - drawnCount
  const lastDrawn = drawnNumbers.length > 0
    ? drawnNumbers[drawnNumbers.length - 1]
    : null
  const drawnNumbersRecentFirst = [...drawnNumbers].reverse()

  return {
    drawnNumbers,
    drawnNumbersRecentFirst,
    drawnCount,
    remainingCount,
    lastDrawn,
    startedAt,
    isConnected,
    isLoading,
  }
}