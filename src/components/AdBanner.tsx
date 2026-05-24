// ============================================
// D-IA/NE BINGO TRACKER v1.1
// Composant : Espace Publicitaire (AdBanner)
// ============================================
// Composant evolutif : commence en version simple
// (placeholder), sera ameliore au fil du temps.
// UNIQUEMENT sur la page spectateur (/live).

interface AdBannerProps {
  className?: string
}

function AdBanner({ className = '' }: AdBannerProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="
        bg-slate-800/80
        border border-slate-600
        rounded-xl
        px-4 py-3
        flex items-center justify-center
        min-h-[60px]
        relative
        overflow-hidden
      ">
        {/* Etiquette discrete "Publicite" */}
        <span className="
          absolute top-1 right-2
          text-slate-500 text-xs
          font-mono uppercase tracking-wider
        ">
          Publicite
        </span>

        {/* Contenu de la pub (a personnaliser) */}
        <div className="flex items-center gap-4 text-center">
          <i className="fa-solid fa-bullhorn text-slate-400 text-xl"></i>
          <div>
            <p className="text-slate-300 font-bold text-sm sm:text-base">
              Votre message publicitaire ici
            </p>
            <p className="text-slate-500 text-xs mt-0.5">
              Commanditaire officiel du D-IA/NE Bingo — Sherbrooke
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdBanner