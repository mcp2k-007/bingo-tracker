// ============================================
// D-IA-NE Bingo Tracker v1.2 - Loi 25
// Composant : Banniere de consentement
// ============================================
// S'affiche tant que l'utilisateur n'a pas decide (consent === null).
// Loi 25 : le refus doit etre AUSSI simple que l'acceptation -> deux boutons
// de meme importance. Le refus ne bloque pas l'acces au bingo.

import { useConsent } from '../hooks/useConsent'

export default function ConsentBanner() {
  const { decided, grant, refuse } = useConsent()

  if (decided) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-slate-800/95 backdrop-blur border-t border-slate-700 px-4 py-3 shadow-2xl">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 text-sm text-slate-300 leading-snug">
          <span className="font-bold text-white">Respect de votre vie privee. </span>
          Ce site mesure l'audience en direct de facon anonyme. Avec votre accord, on peut aussi
          estimer votre region (ville / province) pour nos statistiques. Refuser ne bloque pas
          l'acces au bingo.{' '}
          <a
            href="/confidentialite"
            className="text-red-400 underline underline-offset-2 hover:text-red-300 whitespace-nowrap"
          >
            En savoir plus
          </a>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={refuse}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 active:scale-95 transition text-sm font-semibold text-slate-200"
          >
            Refuser
          </button>
          <button
            onClick={grant}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 active:scale-95 transition text-sm font-semibold text-white"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}
