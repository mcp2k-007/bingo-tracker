// ============================================
// D-IA-NE Bingo Tracker v1.2 - Phase 3.6
// Page : /stats - Dashboard analytics commanditaires
// ============================================
// Protegee par un mot de passe (barriere cote client via VITE_STATS_PASSWORD).
// Lit la table "viewer_sessions" et calcule les metriques de vente :
//   - Sessions totales (regroupees par session_id -> fusionne les doublons StrictMode)
//   - Pic de spectateurs simultanes (+ quand)
//   - Duree moyenne d'ecoute
//   - Spectateurs-minutes (portee x temps)
//   - Repartition par jour
//
// NOTE SECURITE : le mot de passe est dans le bundle (barriere, pas un coffre-fort).
// Vraie auth = Supabase Auth (v1.3).

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import Footer from '../components/Footer'

// Mot de passe d'acces (defini dans .env.local + Vercel : VITE_STATS_PASSWORD)
const STATS_PASSWORD = import.meta.env.VITE_STATS_PASSWORD as string | undefined

// Duree minimale (en secondes) pour qu'une session "compte" (filtre les bounces
// et les fantomes StrictMode de duree 0).
const MIN_SESSION_SECONDS = 5

interface SessionRow {
  id: string
  session_id: string
  started_at: string
  last_seen_at: string
  user_agent: string | null
  referrer: string | null
}

interface MergedSession {
  sessionId: string
  start: number // ms epoch
  end: number   // ms epoch
  durationSec: number
}

interface DayBucket {
  key: string        // yyyy-mm-dd
  sessions: number
  peak: number
  totalMinutes: number
}

const MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

function dayKey(ms: number): string {
  const d = new Date(ms)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function fmtDay(key: string): string {
  const [y, m, d] = key.split('-').map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}`
}

function fmtClock(ms: number): string {
  const d = new Date(ms)
  return `${String(d.getHours()).padStart(2, '0')} h ${String(d.getMinutes()).padStart(2, '0')}`
}

function fmtDuration(seconds: number): string {
  const s = Math.round(seconds)
  const m = Math.floor(s / 60)
  const sec = s % 60
  if (m === 0) return `${sec} s`
  return `${m} min ${String(sec).padStart(2, '0')} s`
}

// Pic d'intervalles qui se chevauchent (sweep-line).
function computePeak(sessions: MergedSession[]): { peak: number; at: number | null } {
  const events: { t: number; delta: number }[] = []
  for (const s of sessions) {
    events.push({ t: s.start, delta: +1 })
    events.push({ t: s.end, delta: -1 })
  }
  // Tri par temps ; a egalite, on traite les arrivees (+1) avant les departs (-1).
  events.sort((a, b) => a.t - b.t || b.delta - a.delta)
  let cur = 0, peak = 0, at: number | null = null
  for (const e of events) {
    cur += e.delta
    if (cur > peak) { peak = cur; at = e.t }
  }
  return { peak, at }
}

function Stats() {
  // --- Etat d'authentification (barriere mot de passe) ---
  const [authed, setAuthed] = useState<boolean>(() => {
    try { return sessionStorage.getItem('stats_authed') === '1' } catch { return false }
  })
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState('')

  function tryUnlock() {
    if (!STATS_PASSWORD) {
      setPwError('VITE_STATS_PASSWORD non configurée (voir .env.local / Vercel).')
      return
    }
    if (pwInput === STATS_PASSWORD) {
      setAuthed(true)
      setPwError('')
      try { sessionStorage.setItem('stats_authed', '1') } catch { /* ignore */ }
    } else {
      setPwError('Mot de passe incorrect.')
    }
  }

  function lock() {
    setAuthed(false)
    setPwInput('')
    try { sessionStorage.removeItem('stats_authed') } catch { /* ignore */ }
  }

  // --- Donnees ---
  const [rows, setRows] = useState<SessionRow[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')

  async function load() {
    setLoading(true)
    setLoadError('')
    try {
      const { data, error } = await supabase
        .from('viewer_sessions')
        .select('id, session_id, started_at, last_seen_at, user_agent, referrer')
        .order('started_at', { ascending: true })
      if (error) throw error
      setRows((data ?? []) as SessionRow[])
    } catch {
      setLoadError('Erreur de chargement des données Supabase.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authed) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed])

  // --- Calcul des metriques (memoise) ---
  const metrics = useMemo(() => {
    if (!rows) return null

    // 1. Regrouper par session_id (fusionne les doublons StrictMode)
    const map = new Map<string, MergedSession>()
    for (const r of rows) {
      const s = new Date(r.started_at).getTime()
      const e = new Date(r.last_seen_at).getTime()
      const cur = map.get(r.session_id)
      if (!cur) {
        map.set(r.session_id, { sessionId: r.session_id, start: s, end: e, durationSec: 0 })
      } else {
        cur.start = Math.min(cur.start, s)
        cur.end = Math.max(cur.end, e)
      }
    }
    for (const m of map.values()) m.durationSec = Math.max(0, (m.end - m.start) / 1000)

    // 2. Filtrer les sessions valides (>= MIN_SESSION_SECONDS)
    const valid = [...map.values()].filter((m) => m.durationSec >= MIN_SESSION_SECONDS)
    const rawCount = map.size

    if (valid.length === 0) {
      return { totalSessions: 0, rawCount, peak: 0, peakAt: null, avgSec: 0, viewerMinutes: 0, byDay: [] as DayBucket[] }
    }

    // 3. KPIs globaux
    const { peak, at: peakAt } = computePeak(valid)
    const totalSec = valid.reduce((acc, m) => acc + m.durationSec, 0)
    const avgSec = totalSec / valid.length
    const viewerMinutes = Math.round(totalSec / 60)

    // 4. Repartition par jour
    const dayMap = new Map<string, MergedSession[]>()
    for (const m of valid) {
      const k = dayKey(m.start)
      const arr = dayMap.get(k)
      if (arr) arr.push(m)
      else dayMap.set(k, [m])
    }
    const byDay: DayBucket[] = [...dayMap.entries()]
      .map(([key, list]) => ({
        key,
        sessions: list.length,
        peak: computePeak(list).peak,
        totalMinutes: Math.round(list.reduce((a, m) => a + m.durationSec, 0) / 60),
      }))
      .sort((a, b) => (a.key < b.key ? 1 : -1)) // plus recent en premier

    return { totalSessions: valid.length, rawCount, peak, peakAt, avgSec, viewerMinutes, byDay }
  }, [rows])

  // ============================================
  // RENDU : barriere mot de passe
  // ============================================
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 px-4">
        <div className="w-full max-w-sm bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <i className="fa-solid fa-lock text-red-500"></i>
            <h1 className="font-display text-lg font-bold text-white">Statistiques - Accès protégé</h1>
          </div>
          <p className="text-sm text-slate-400 mb-4">Entre le mot de passe pour voir les statistiques commanditaires.</p>
          <input
            type="password"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') tryUnlock() }}
            placeholder="Mot de passe"
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 mb-3"
            autoFocus
          />
          {pwError && <p className="text-sm text-red-400 mb-3">{pwError}</p>}
          <button
            onClick={tryUnlock}
            className="w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 active:scale-95 transition font-semibold text-white"
          >
            Entrer
          </button>
          <a href="/live" className="block text-center text-xs text-slate-500 hover:text-slate-300 mt-4 transition">Retour à /live</a>
        </div>
      </div>
    )
  }

  // ============================================
  // RENDU : dashboard
  // ============================================
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <header className="bg-slate-900 border-b border-slate-800 flex justify-between items-center px-4 py-3 select-none">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-chart-line text-red-500"></i>
          <h1 className="font-display text-base sm:text-lg font-bold text-white">D&bull;IA&bull;NE Statistiques <span className="text-xs text-red-500 font-normal bg-red-500/10 px-2 py-0.5 rounded-full ml-1">commanditaires</span></h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} title="Rafraîchir" className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 active:scale-95 transition text-sm font-semibold flex items-center gap-2">
            <i className={`fa-solid fa-rotate ${loading ? 'fa-spin' : ''}`}></i>
            <span className="hidden sm:inline">Rafraîchir</span>
          </button>
          <button onClick={lock} title="Verrouiller" className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 transition text-sm font-semibold flex items-center gap-2 text-slate-400">
            <i className="fa-solid fa-lock"></i>
          </button>
        </div>
      </header>

      <main className="flex-grow px-4 py-5 max-w-5xl w-full mx-auto">
        {loading && rows === null && (
          <div className="text-center py-16 text-slate-400">
            <i className="fa-solid fa-circle-notch fa-spin text-red-500 text-3xl mb-3"></i>
            <p>Chargement des données...</p>
          </div>
        )}

        {loadError && (
          <div className="bg-red-500/10 border border-red-500/40 rounded-xl px-4 py-3 text-red-300 mb-4">{loadError}</div>
        )}

        {metrics && metrics.totalSessions === 0 && !loading && (
          <div className="text-center py-16 text-slate-400">
            <i className="fa-solid fa-chart-simple text-slate-600 text-4xl mb-3"></i>
            <p className="font-semibold text-slate-300">Aucune session valide pour l'instant.</p>
            <p className="text-sm mt-1">Ouvre <a href="/live" className="text-red-400 underline">/live</a> et reste quelques secondes pour générer des données.</p>
            {metrics.rawCount > 0 && (
              <p className="text-xs text-slate-500 mt-2">({metrics.rawCount} ligne(s) brute(s) trop courte(s) ou fantôme(s), filtrée(s).)</p>
            )}
          </div>
        )}

        {metrics && metrics.totalSessions > 0 && (
          <>
            {/* Cartes KPI */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <KpiCard label="Sessions totales" value={String(metrics.totalSessions)} icon="fa-users" accent="text-red-400" />
              <KpiCard
                label="Pic de simultanés"
                value={String(metrics.peak)}
                sub={metrics.peakAt ? `${fmtDay(dayKey(metrics.peakAt))} à ${fmtClock(metrics.peakAt)}` : undefined}
                icon="fa-arrow-trend-up"
                accent="text-emerald-400"
              />
              <KpiCard label="Durée moyenne" value={fmtDuration(metrics.avgSec)} icon="fa-stopwatch" accent="text-sky-400" />
              <KpiCard label="Spectateurs-minutes" value={String(metrics.viewerMinutes)} sub="portée x temps" icon="fa-clock" accent="text-amber-400" />
            </div>

            {/* Tableau par jour */}
            <div className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-2">
                <i className="fa-solid fa-calendar-days text-slate-400"></i>
                <h2 className="font-display font-bold text-white">Répartition par jour</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700/70">
                      <th className="text-left font-semibold px-4 py-2">Date</th>
                      <th className="text-right font-semibold px-4 py-2">Sessions</th>
                      <th className="text-right font-semibold px-4 py-2">Pic simultané</th>
                      <th className="text-right font-semibold px-4 py-2">Total minutes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.byDay.map((d) => (
                      <tr key={d.key} className="border-b border-slate-800 hover:bg-slate-800/40 transition">
                        <td className="px-4 py-2.5 font-medium text-slate-200">{fmtDay(d.key)}</td>
                        <td className="px-4 py-2.5 text-right font-extrabold text-red-400 tabular-nums">{d.sessions}</td>
                        <td className="px-4 py-2.5 text-right font-extrabold text-emerald-400 tabular-nums">{d.peak}</td>
                        <td className="px-4 py-2.5 text-right text-slate-300 tabular-nums">{d.totalMinutes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-4">
              Sessions regroupées par appareil. Les sessions de moins de {MIN_SESSION_SECONDS}s sont filtrées (bounces / fantômes).
              {metrics.rawCount > metrics.totalSessions && ` (${metrics.rawCount - metrics.totalSessions} ligne(s) filtrée(s).)`}
            </p>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

// Petite carte KPI reutilisable
function KpiCard({ label, value, sub, icon, accent }: { label: string; value: string; sub?: string; icon: string; accent: string }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider">
        <i className={`fa-solid ${icon} ${accent}`}></i>
        <span>{label}</span>
      </div>
      <div className={`text-2xl sm:text-3xl font-extrabold leading-tight ${accent}`}>{value}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  )
}

export default Stats
