// ============================================
// D-IA-NE Bingo Tracker v1.2 - Phase 3.6 (3/3)
// Hook : Session de spectateur (tracking persistant + geoloc)
// ============================================
// Enregistre une SESSION dans la table Supabase "viewer_sessions" pour les
// analytics commanditaires. A appeler UNIQUEMENT depuis la page /live.
//
//   1. Au montage : INSERT une ligne -> on recupere son id.
//   2. Toutes les 20s : UPDATE last_seen_at = now() (heartbeat).
//      -> la duree d'ecoute = last_seen_at - started_at (calculee dans /stats).
//      -> le pic de spectateurs simultanes se deduit des intervalles.
//   3. GEOLOC (NOUVEAU) : une seule fois, on capte ville/region/pays via une API
//      IP tierce (ipwho.is) puis on UPDATE la ligne -> SEULEMENT si le consentement
//      Loi 25 est accorde (getConsent() === 'granted').
//   4. Au demontage : dernier battement "best effort" (pas garanti sur mobile,
//      c'est pour ca qu'on se fie au heartbeat plutot qu'aux evenements unload).
//
// CONFIDENTIALITE (Loi 25) : on ne stocke JAMAIS l'IP brute, seulement la geo
// grossiere (ville/region/pays). Le consentement peut arriver APRES le montage
// (la banniere s'affiche apres) : on re-verifie donc a chaque battement tant que
// la geo n'a pas encore ete captee -> aucune course a gerer manuellement.
//
// DEFENSIF : si Supabase ou l'API geo est indisponible, le hook ne fait rien et
// ne plante JAMAIS l'interface (critique pendant un tirage en direct).

import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { getConsent } from './useConsent'

const HEARTBEAT_MS = 20000 // 20 secondes

// API de geolocalisation par IP : HTTPS natif, gratuite, sans cle.
// On ne demande que le strict necessaire (success + ville/region/pays).
const GEO_ENDPOINT = 'https://ipwho.is/?fields=success,city,region,country'

// Identifiant de session stable, unique par onglet/appareil.
function makeSessionId(): string {
  return 'vs-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

type GeoData = { city: string | null; region: string | null; country: string | null }

// Recupere la geo grossiere depuis l'IP de l'appareil. Retourne null si echec
// ou si aucune donnee exploitable (jamais d'exception remontee).
async function fetchGeo(): Promise<GeoData | null> {
  try {
    const res = await fetch(GEO_ENDPOINT)
    if (!res.ok) return null
    const j = await res.json()
    if (!j || j.success === false) return null
    const clean = (v: unknown): string | null =>
      typeof v === 'string' && v.trim() ? v.trim() : null
    const geo: GeoData = { city: clean(j.city), region: clean(j.region), country: clean(j.country) }
    if (!geo.city && !geo.region && !geo.country) return null
    return geo
  } catch {
    return null
  }
}

export function useViewerSession() {
  const sessionIdRef = useRef<string>(makeSessionId())
  const rowIdRef = useRef<string | null>(null)
  const geoCapturedRef = useRef<boolean>(false) // geo deja enregistree pour cette session
  const geoInFlightRef = useRef<boolean>(false) // un appel geo est en cours (anti-doublon)

  useEffect(() => {
    let cancelled = false
    let heartbeat: ReturnType<typeof setInterval> | null = null

    // Capte + enregistre la geo UNE seule fois, et seulement si consentement accorde.
    async function captureGeo() {
      if (geoCapturedRef.current || geoInFlightRef.current) return
      if (getConsent() !== 'granted') return // gate Loi 25
      const id = rowIdRef.current
      if (!id) return

      geoInFlightRef.current = true
      try {
        const geo = await fetchGeo()
        if (!geo || cancelled) return
        await supabase
          .from('viewer_sessions')
          .update({ city: geo.city, region: geo.region, country: geo.country })
          .eq('id', id)
        geoCapturedRef.current = true
      } catch {
        /* API geo indispo : on n'enregistre rien, jamais de crash. */
      } finally {
        geoInFlightRef.current = false
      }
    }

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

        // Tentative immediate de geoloc (si le consentement est deja accorde).
        captureGeo()

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
      // Si le consentement vient juste d'etre accorde, on capte la geo ici
      // (rattrapage du cas "consentement donne apres le montage").
      captureGeo()
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
