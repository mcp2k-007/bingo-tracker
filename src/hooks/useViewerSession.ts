// ============================================
// D-IA-NE Bingo Tracker v1.2 - Phase 3.6
// Hook : Session de spectateur (tracking persistant)
// ============================================
// Enregistre une SESSION dans la table Supabase "viewer_sessions" pour les
// analytics commanditaires. A appeler UNIQUEMENT depuis la page /live.
//
//   1. Au montage : INSERT une ligne -> on recupere son id.
//   2. Toutes les 20s : UPDATE last_seen_at = now() (heartbeat).
//      -> la duree d'ecoute = last_seen_at - started_at (calculee dans /stats).
//      -> le pic de spectateurs simultanes se deduit des intervalles.
//   3. Au demontage : dernier battement "best effort" (pas garanti sur mobile,
//      c'est pour ca qu'on se fie au heartbeat plutot qu'aux evenements unload).
//
// DEFENSIF : si Supabase est indisponible, le hook ne fait rien et ne plante
// JAMAIS l'interface (critique pendant un tirage en direct).

import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const HEARTBEAT_MS = 20000 // 20 secondes

// Identifiant de session stable, unique par onglet/appareil.
function makeSessionId(): string {
  return 'vs-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function useViewerSession() {
  const sessionIdRef = useRef<string>(makeSessionId())
  const rowIdRef = useRef<string | null>(null)

  useEffect(() => {
    let cancelled = false
    let heartbeat: ReturnType<typeof setInterval> | null = null

    async function start() {
      try {
        const ua = typeof navigator !== 'undefined' ? navigator.userAgent : null
        const ref = typeof document !== 'undefined' ? (document.referrer || null) : null

        const { data, error } = await supabase
          .from('viewer_sessions')
          .insert({ session_id: sessionIdRef.current, user_agent: ua, referrer: ref })
          .select('id')
          .single()

        if (error || !data) return
        // Si le composant a ete demonte avant la fin de l'insert (ex: StrictMode
        // en dev), on annule proprement pour ne pas lancer un heartbeat orphelin.
        if (cancelled) return

        rowIdRef.current = data.id as string

        heartbeat = setInterval(() => {
          beat()
        }, HEARTBEAT_MS)
      } catch {
        /* Supabase indispo : on ne fait rien, jamais de crash. */
      }
    }

    async function beat() {
      const id = rowIdRef.current
      if (!id) return
      try {
        await supabase
          .from('viewer_sessions')
          .update({ last_seen_at: new Date().toISOString() })
          .eq('id', id)
      } catch {
        /* ignore */
      }
    }

    start()

    return () => {
      cancelled = true
      if (heartbeat) clearInterval(heartbeat)
      // Dernier battement best-effort a la fermeture.
      const id = rowIdRef.current
      if (id) {
        try {
          supabase
            .from('viewer_sessions')
            .update({ last_seen_at: new Date().toISOString() })
            .eq('id', id)
        } catch {
          /* ignore */
        }
      }
    }
  }, [])
}
