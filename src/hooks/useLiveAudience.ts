// ============================================
// D-IA-NE BINGO Tracker v1.2
// Hook : Audience en direct (presence temps reel)
// ============================================
// Compte le nombre de spectateurs presents sur la page /live, en temps reel,
// via Supabase Realtime Presence (reutilise le client Supabase existant).
//
//   trackSelf = true  -> la page s'inscrit comme spectateur (page /live)
//   trackSelf = false -> la page observe seulement le compte (interface Diane)
//
// DEFENSIF : si Supabase a un hoquet, le compteur reste a 0 et ne plante JAMAIS
// l'interface (critique le jour d'un tirage).

import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

const AUDIENCE_CHANNEL = 'live-audience'

export function useLiveAudience(trackSelf: boolean) {
  const [count, setCount] = useState<number>(0)
  // Cle de presence unique et stable pour cette page/onglet
  const keyRef = useRef<string>('v-' + Math.random().toString(36).slice(2) + Date.now().toString(36))

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null

    try {
      channel = supabase.channel(AUDIENCE_CHANNEL, {
        config: { presence: { key: keyRef.current } },
      })

      // Recompte les spectateurs (entrees marquees "viewer")
      const recount = () => {
        try {
          const state = channel!.presenceState() as Record<string, Array<{ role?: string }>>
          let n = 0
          for (const k of Object.keys(state)) {
            const metas = state[k]
            if (metas && metas.some((m) => m.role === 'viewer')) n++
          }
          setCount(n)
        } catch {
          /* ignore */
        }
      }

      channel
        .on('presence', { event: 'sync' }, recount)
        .on('presence', { event: 'join' }, recount)
        .on('presence', { event: 'leave' }, recount)
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED' && trackSelf && channel) {
            try {
              await channel.track({ role: 'viewer', at: Date.now() })
            } catch {
              /* ignore */
            }
          }
        })
    } catch {
      /* Supabase indisponible : on laisse count a 0, jamais de crash */
    }

    return () => {
      try {
        if (channel) supabase.removeChannel(channel)
      } catch {
        /* ignore */
      }
    }
  }, [trackSelf])

  return { count }
}
