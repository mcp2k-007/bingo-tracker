// ============================================
// D-IA/NE BINGO TRACKER v1.1
// Composant : Espace Publicitaire (AdBanner)
// ============================================
// Affiche le logo du commanditaire (image dans /public).
// Clic -> redirige vers le site du sponsor (nouvel onglet).

interface AdBannerProps {
  className?: string
}

function AdBanner({ className = '' }: AdBannerProps) {
  const sponsorUrl = 'https://k1037.com/radiobingo/'
  const sponsorLogo = '/sponsor-k1037.jpg'

  return (
    <a href={sponsorUrl} target="_blank" rel="noopener noreferrer" title="Visitez K103.7 Radio Bingo" className={`block w-full group ${className}`}>
      <div className="bg-slate-800/80 border border-slate-600 rounded-xl px-4 py-2 flex items-center justify-center min-h-[64px] relative overflow-hidden transition hover:bg-slate-700/80 hover:border-red-500/50 cursor-pointer">
        <span className="absolute top-1 right-2 text-slate-500 text-xs font-mono uppercase tracking-wider z-10">
          Publicite
        </span>
        <div className="bg-white rounded-lg px-5 py-2 flex items-center justify-center shadow-md group-hover:scale-[1.03] transition">
          <img src={sponsorLogo} alt="K103.7 Radio Bingo - Kahnawake" className="h-10 sm:h-12 w-auto object-contain" />
        </div>
        <i className="fa-solid fa-arrow-up-right-from-square absolute bottom-1 right-2 text-slate-500 text-xs group-hover:text-red-400 transition"></i>
      </div>
    </a>
  )
}

export default AdBanner