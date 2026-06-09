// ============================================
// D-IA-NE Bingo Tracker v1.2 - Loi 25
// Page : /confidentialite - Politique de confidentialite
// ============================================
// MODELE DE DEPART - a faire reviser/adapter par Paskal (et idealement valider
// au regard de la Loi 25 / CAI du Quebec). Le code est fonctionnel ; le TEXTE
// legal est une base, pas un avis juridique.
// (Texte affiche accentue pour le professionnalisme ; commentaires sans accents.)

import { useConsent } from '../hooks/useConsent'

export default function Confidentialite() {
  const { consent, reset } = useConsent()

  const statutTexte =
    consent === 'granted' ? 'Vous avez ACCEPTÉ la collecte de votre région approximative.'
    : consent === 'refused' ? 'Vous avez REFUSÉ la collecte de votre région approximative.'
    : 'Aucun choix enregistré pour le moment.'

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-2 select-none">
        <i className="fa-solid fa-shield-halved text-red-500"></i>
        <h1 className="font-display text-base sm:text-lg font-bold text-white">Politique de confidentialité</h1>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6 text-sm leading-relaxed text-slate-300">
        <p className="text-slate-400">
          D&bull;IA&bull;NE Bingo Tracker mesure l'audience de ses diffusions de bingo en direct.
          Cette page explique quelles données sont recueillies et vos choix. (Document de départ -
          à faire réviser.)
        </p>

        <section>
          <h2 className="font-display font-bold text-white mb-1">1. Données recueillies</h2>
          <p><span className="font-semibold text-slate-200">Sans consentement (anonyme) :</span> une session anonyme (début, fin, durée), le type d'appareil et le navigateur. Ces données servent uniquement à compter l'audience et ne vous identifient pas.</p>
          <p className="mt-2"><span className="font-semibold text-slate-200">Avec votre consentement :</span> votre région approximative (ville / province), estimée à partir de votre adresse IP. L'adresse IP est considérée comme un renseignement personnel.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-white mb-1">2. Pourquoi</h2>
          <p>Pour produire des statistiques d'audience (nombre de spectateurs, pics, durée d'écoute, portée géographique) présentées à nos commanditaires sous forme agrégée.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-white mb-1">3. Conservation et partage</h2>
          <p>Les données sont stockées sur Supabase. Les chiffres partagés aux commanditaires sont <span className="font-semibold text-slate-200">agrégés et anonymes</span> ; aucune donnée individuelle n'est vendue.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-white mb-1">4. Vos droits (Loi 25)</h2>
          <p>Vous pouvez accepter ou refuser librement, retirer votre consentement à tout moment, et demander l'accès ou la rectification de vos renseignements.</p>
        </section>

        <section className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
          <h2 className="font-display font-bold text-white mb-1">5. Modifier mon choix</h2>
          <p className="mb-3 text-slate-400">{statutTexte}</p>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 active:scale-95 transition text-sm font-semibold text-white"
          >
            Réinitialiser mes préférences
          </button>
          <p className="mt-2 text-xs text-slate-500">La bannière de consentement réapparaîtra à votre prochaine visite de la page spectateur.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-white mb-1">6. Contact</h2>
          <p>Pour toute question : <a href="mailto:paskal.brochu@gmail.com" className="text-red-400 underline underline-offset-2">paskal.brochu@gmail.com</a></p>
        </section>

        <div className="pt-2">
          <a href="/live" className="text-sm text-slate-400 hover:text-slate-200 transition">&larr; Retour à la page spectateur</a>
        </div>
      </main>
    </div>
  )
}
