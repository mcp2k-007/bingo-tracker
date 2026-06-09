// ============================================
// D-IA-NE Bingo Tracker v1.2 - Loi 25
// Page : /confidentialite - Politique de confidentialite
// ============================================
// MODELE DE DEPART - a faire reviser/adapter par Paskal (et idealement valider
// au regard de la Loi 25 / CAI du Quebec). Le code est fonctionnel ; le TEXTE
// legal est une base, pas un avis juridique.

import { useConsent } from '../hooks/useConsent'

export default function Confidentialite() {
  const { consent, reset } = useConsent()

  const statutTexte =
    consent === 'granted' ? 'Vous avez ACCEPTE la collecte de votre region approximative.'
    : consent === 'refused' ? 'Vous avez REFUSE la collecte de votre region approximative.'
    : 'Aucun choix enregistre pour le moment.'

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-2 select-none">
        <i className="fa-solid fa-shield-halved text-red-500"></i>
        <h1 className="font-display text-base sm:text-lg font-bold text-white">Politique de confidentialite</h1>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6 text-sm leading-relaxed text-slate-300">
        <p className="text-slate-400">
          D&bull;IA&bull;NE Bingo Tracker mesure l'audience de ses diffusions de bingo en direct.
          Cette page explique quelles donnees sont recueillies et vos choix. (Document de depart -
          a faire reviser.)
        </p>

        <section>
          <h2 className="font-display font-bold text-white mb-1">1. Donnees recueillies</h2>
          <p><span className="font-semibold text-slate-200">Sans consentement (anonyme) :</span> une session anonyme (debut, fin, duree), le type d'appareil et le navigateur. Ces donnees servent uniquement a compter l'audience et ne vous identifient pas.</p>
          <p className="mt-2"><span className="font-semibold text-slate-200">Avec votre consentement :</span> votre region approximative (ville / province), estimee a partir de votre adresse IP. L'adresse IP est consideree comme un renseignement personnel.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-white mb-1">2. Pourquoi</h2>
          <p>Pour produire des statistiques d'audience (nombre de spectateurs, pics, duree d'ecoute, portee geographique) presentees a nos commanditaires sous forme agregee.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-white mb-1">3. Conservation et partage</h2>
          <p>Les donnees sont stockees sur Supabase. Les chiffres partages aux commanditaires sont <span className="font-semibold text-slate-200">agreges et anonymes</span> ; aucune donnee individuelle n'est vendue.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-white mb-1">4. Vos droits (Loi 25)</h2>
          <p>Vous pouvez accepter ou refuser librement, retirer votre consentement a tout moment, et demander l'acces ou la rectification de vos renseignements.</p>
        </section>

        <section className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
          <h2 className="font-display font-bold text-white mb-1">5. Modifier mon choix</h2>
          <p className="mb-3 text-slate-400">{statutTexte}</p>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 active:scale-95 transition text-sm font-semibold text-white"
          >
            Reinitialiser mes preferences
          </button>
          <p className="mt-2 text-xs text-slate-500">La banniere de consentement reapparaitra a votre prochaine visite de la page spectateur.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-white mb-1">6. Contact</h2>
          <p>Pour toute question : <a href="mailto:paskal.brochu@gmail.com" className="text-red-400 underline underline-offset-2">paskal.brochu@gmail.com</a></p>
        </section>

        <div className="pt-2">
          <a href="/live" className="text-sm text-slate-400 hover:text-slate-200 transition">&larr; Retour a la page spectateur</a>
        </div>
      </main>
    </div>
  )
}
