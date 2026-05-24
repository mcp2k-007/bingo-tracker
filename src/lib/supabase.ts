// ============================================
// D-IA/NE BINGO TRACKER v1.1
// Client Supabase - Connexion a la base de donnees
// ============================================

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables Supabase manquantes dans .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

export interface GameStateRow {
  id: string
  drawn_numbers: number[]
  started_at: string | null
  updated_at: string
}