// ============================================
// D-IA-NE Bingo Tracker v1.2 - Loi 25
// Hook : Gestion du consentement (vie privee)
// ============================================
// Source unique de verite pour le consentement Loi 25.
//   - 'granted' : l'utilisateur accepte la collecte (debloque la geoloc)
//   - 'refused' : l'utilisateur refuse (aucune donnee personnelle collectee)
//   - null      : pas encore decide -> on affiche la banniere
//
// Stocke dans localStorage (persiste entre les visites). getConsent() permet
// une lecture synchrone hors composant (ex: depuis useViewerSession pour la geoloc).

import { useEffect, useState } from 'react'

export type ConsentStatus = 'granted' | 'refused' | null

const STORAGE_KEY = 'diane_consent_loi25_v1'

function readConsent(): ConsentStatus {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'granted' || v === 'refused' ? v : null
  } catch {
    return null
  }
}

// Lecture synchrone, utilisable n'importe ou (pas seulement dans un composant).
export function getConsent(): ConsentStatus {
  return readConsent()
}

export function useConsent() {
  const [consent, setConsent] = useState<ConsentStatus>(() => readConsent())

  // Synchronise le choix entre les onglets ouverts.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setConsent(readConsent())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function grant() {
    try { localStorage.setItem(STORAGE_KEY, 'granted') } catch { /* ignore */ }
    setConsent('granted')
  }

  function refuse() {
    try { localStorage.setItem(STORAGE_KEY, 'refused') } catch { /* ignore */ }
    setConsent('refused')
  }

  // Reinitialise le choix -> la banniere reapparaitra (retrait du consentement).
  function reset() {
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
    setConsent(null)
  }

  return { consent, grant, refuse, reset, decided: consent !== null }
}
