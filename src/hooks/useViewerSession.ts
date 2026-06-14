// ============================================
// D-IA-NE Bingo Tracker v1.2 - Analytics commanditaires
// Hook : Session de spectateur (tracking + metriques anonymes + geoloc)
// ============================================
// A appeler UNIQUEMENT depuis /live.
//
//   1. Au montage : INSERT une ligne (+ metriques anonymes) -> on recupere son id.
//   2. Toutes les 20s : UPDATE heartbeat (last_seen_at + temps actif + audio).
//   3. GEOLOC : ville/region/pays via API IP tierce, SEULEMENT si consentement
//      Loi 25 accorde (getConsent() === 'granted'). Jamais l'IP brute.
//   4. Au demontage : dernier battement best-effort.
//
// METRIQUES ANONYMES (aucun consentement requis -- ne servent pas a identifier) :
//   appareil, navigateur, OS, langue, fuseau, PWA, temps actif (focus),
//   ecoute audio CIGN (oui/non + duree), attribution UTM.
//
// DEFENSIF : si Supabase ou l'API geo est indisponible, le hook ne plante JAMAIS
// l'interface (critique pendant un tirage en direct).

import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { getConsent } from './useConsent'

const HEARTBEAT_MS = 20000   // 20 secondes
const GEO_MAX_ATTEMPTS = 3   // borne les tentatives geo (anti-spam si l'API bloque)

type GeoData = { city: string | null; region: string | null; country: string | null }

const clean = (v: unknown): string | null =>
  typeof v === 'string' && v.trim() ? v.trim() : null

// --- Geoloc : geojs.io (primaire) + freeipapi.com (secours) -----------
// NB: ipwho.is renvoyait 403 dans le navigateur -> abandonne.
async function fetchGeo(): Promise<GeoData | null> {
  // 1) geojs.io
  try {
    const res = await fetch('https://get.geojs.io/v1/ip/geo.json')
    if (res.ok) {
      const j = await res.json()
      const geo: GeoData = { city: clean(j.city), region: clean(j.region), country: clean(j.country) }
      if (geo.city || geo.region || geo.country) return geo
    }
  } catch { /* on tente le secours */ }
  // 2) freeipapi.com (secours)
  try {
    const res = await fetch('https://freeipapi.com/api/json')
    if (res.ok) {
      const j = await res.json()
      const geo: GeoData = { city: clean(j.cityName), region: clean(j.regionName), country: clean(j.countryName) }
      if (geo.city || geo.region || geo.country) return geo
    }
  } catch { /* echec total */ }
  return null
}

// --- Identifiant de session (stable par onglet/appareil) --------------
function makeSessionId(): string {
  return 'vs-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// --- Parsing user-agent -> appareil / navigateur / OS -----------------
function parseUA(ua: string) {
  const s = ua.toLowerCase()
  // Appareil
  let device = 'desktop'
  if (/ipad|tablet|playbook|silk/.test(s) || (/android/.test(s) && !/mobile/.test(s))) device = 'tablet'
  else if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/.test(s)) device = 'mobile'
  // Navigateur (ordre important : Edge/Opera/Samsung contiennent "chrome")
  let browser = 'Autre'
  if (/edg\//.test(s)) browser = 'Edge'
  else if (/opr\/|opera/.test(s)) browser = 'Opera'
  else if (/samsungbrowser/.test(s)) browser = 'Samsung Internet'
  else if (/chrome|crios/.test(s)) browser = 'Chrome'
  else if (/firefox|fxios/.test(s)) browser = 'Firefox'
  else if (/safari/.test(s)) browser = 'Safari'
  // OS (Android contient "linux" -> on le teste avant Linux)
  let os = 'Autre'
  if (/iphone|ipad|ipod/.test(s)) os = 'iOS'
  else if (/android/.test(s)) os = 'Android'
  else if (/windows/.test(s)) os = 'Windows'
  else if (/macintosh|mac os x/.test(s)) os = 'macOS'
  else if (/linux/.test(s)) os = 'Linux'
  return { device, browser, os }
}

// --- Collecte des metriques anonymes (une fois, a l'insert) -----------
function collectAnon() {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
  const { device, browser, os } = parseUA(ua || '')
  let lang: string | null = null
  let timezone: string | null = null
  let is_pwa = false
  let utm_source: string | null = null
  let utm_medium: string | null = null
  let utm_campaign: string | null = null
  try { lang = clean(navigator.language) } catch { /* ignore */ }
  try { timezone = clean(Intl.DateTimeFormat().resolvedOptions().timeZone) } catch { /* ignore */ }
  try {
    is_pwa =
      (typeof window !== 'undefined' && !!window.matchMedia &&
        window.matchMedia('(display-mode: standalone)').matches) ||
      (navigator as any).standalone === true
  } catch { /* ignore */ }
  try {
    const q = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    utm_source = clean(q.get('utm_source'))
    utm_medium = clean(q.get('utm_medium'))
    utm_campaign = clean(q.get('utm_campaign'))
  } catch { /* ignore */ }
  return {
    user_agent: ua || null,
    device_type: device, browser, os,
    lang, timezone, is_pwa,
    utm_source, utm_medium, utm_campaign,
  }
}

// audioPlaying : etat du flux CIGN (passe depuis /live via useLiveRadio).
export function useViewerSession(audioPlaying: boolean = false) {
  const sessionIdRef = useRef<string>(makeSessionId())
  const rowIdRef = useRef<string | null>(null)
  const geoCapturedRef = useRef<boolean>(false)
  const geoInFlightRef = useRef<boolean>(false)
  const geoAttemptsRef = useRef<number>(0)

  // Temps actif (onglet au premier plan) -- accumulateur en millisecondes.
  const activeMsRef = useRef<number>(0)
  const activeSinceRef = useRef<number | null>(null)
  // Ecoute audio CIGN -- accumulateur + flag "a ecoute".
  const audioMsRef = useRef<number>(0)
  const audioSinceRef = useRef<number | null>(null)
  const audioListenedRef = useRef<boolean>(false)

  const activeSeconds = () => {
    let ms = activeMsRef.current
    if (activeSinceRef.current != null) ms += Date.now() - activeSinceRef.current
    return Math.round(ms / 1000)
  }
  const audioSeconds = () => {
    let ms = audioMsRef.current
    if (audioSinceRef.current != null) ms += Date.now() - audioSinceRef.current
    return Math.round(ms / 1000)
  }

  // Suit l'etat audio (start/stop accumulation) sans relancer l'effet principal.
  useEffect(() => {
    if (audioPlaying) {
      if (audioSinceRef.current == null) audioSinceRef.current = Date.now()
      audioListenedRef.current = true
    } else if (audioSinceRef.current != null) {
      audioMsRef.current += Date.now() - audioSinceRef.current
      audioSinceRef.current = null
    }
  }, [audioPlaying])

  useEffect(() => {
    let cancelled = false
    let heartbeat: ReturnType<typeof setInterval> | null = null

    // Temps actif : demarre si visible, ecoute les changements de visibilite.
    const startActive = () => { if (activeSinceRef.current == null) activeSinceRef.current = Date.now() }
    const stopActive = () => {
      if (activeSinceRef.current != null) {
        activeMsRef.current += Date.now() - activeSinceRef.current
        activeSinceRef.current = null
      }
    }
    const onVisibility = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') startActive()
      else stopActive()
    }
    if (typeof document === 'undefined' || document.visibilityState === 'visible') startActive()
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVisibility)

    async function captureGeo() {
      if (geoCapturedRef.current || geoInFlightRef.current) return
      if (getConsent() !== 'granted') return // gate Loi 25
      const id = rowIdRef.current
      if (!id) return
      if (geoAttemptsRef.current >= GEO_MAX_ATTEMPTS) { geoCapturedRef.current = true; return }
      geoInFlightRef.current = true
      geoAttemptsRef.current += 1
      try {
        const geo = await fetchGeo()
        if (cancelled) return
        if (geo) {
          await supabase.from('viewer_sessions')
            .update({ city: geo.city, region: geo.region, country: geo.country })
            .eq('id', id)
          geoCapturedRef.current = true
        }
      } catch { /* API geo indispo : pas de crash */ }
      finally { geoInFlightRef.current = false }
    }

    async function start() {
      try {
        const ref = typeof document !== 'undefined' ? (document.referrer || null) : null
        const anon = collectAnon()
        const { data, error } = await supabase
          .from('viewer_sessions')
          .insert({ session_id: sessionIdRef.current, referrer: ref, ...anon })
          .select('id')
          .single()
        if (error || !data || cancelled) return
        rowIdRef.current = data.id as string
        captureGeo() // tentative immediate si consentement deja accorde
        heartbeat = setInterval(() => { beat() }, HEARTBEAT_MS)
      } catch { /* Supabase indispo : pas de crash */ }
    }

    async function beat() {
      const id = rowIdRef.current
      if (!id) return
      captureGeo() // rattrapage si le consentement vient d'etre accorde
      try {
        await supabase.from('viewer_sessions').update({
          last_seen_at: new Date().toISOString(),
          active_seconds: activeSeconds(),
          audio_seconds: audioSeconds(),
          audio_listened: audioListenedRef.current,
        }).eq('id', id)
      } catch { /* ignore */ }
    }

    start()

    return () => {
      cancelled = true
      if (heartbeat) clearInterval(heartbeat)
      if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVisibility)
      stopActive()
      if (audioSinceRef.current != null) {
        audioMsRef.current += Date.now() - audioSinceRef.current
        audioSinceRef.current = null
      }
      const id = rowIdRef.current
      if (id) {
        try {
          supabase.from('viewer_sessions').update({
            last_seen_at: new Date().toISOString(),
            active_seconds: activeSeconds(),
            audio_seconds: audioSeconds(),
            audio_listened: audioListenedRef.current,
          }).eq('id', id)
        } catch { /* ignore */ }
      }
    }
  }, [])
}
