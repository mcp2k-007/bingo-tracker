// AdCarousel.tsx
// Banniere publicitaire intelligente.
// - Tant que le nombre de pubs <= SCROLL_THRESHOLD : affichage STATIQUE (centre).
// - Des que le nombre de pubs > SCROLL_THRESHOLD : defilement automatique
//   droite -> gauche (vitesse moyenne), boucle continue sans coupure.
// - 3 gabarits "Votre Logo ICI" sont inclus par defaut pour demarcher les annonceurs.
//
// Remplace l'ancien AdBanner.tsx. La pub commanditaire reelle (K103.7) est conservee
// en premiere position ; ajoute/retire simplement des entrees dans le tableau ADS.

// Seuil de declenchement du defilement : on scrolle uniquement si on depasse 4 pubs.
const SCROLL_THRESHOLD = 4;

type Ad = {
  id: string;
  // Si imageSrc est fourni : on affiche le logo. Sinon : on affiche le texte (gabarit).
  imageSrc?: string;
  alt: string;
  href: string;       // lien au clic (site annonceur OU mailto pour les gabarits)
  text?: string;      // texte affiche pour les gabarits sans logo
  isPlaceholder?: boolean;
};

// ------- CONFIGURATION DES PUBLICITES -------
// 1 pub reelle (commanditaire) + 3 gabarits = 4 entrees => reste STATIQUE.
// Ajoute une 5e entree et le carrousel se met a defiler automatiquement.
const ADS: Ad[] = [
  {
    id: "k1037",
    imageSrc: "/sponsor-k1037.jpg", // fichier en minuscules (Vercel = Linux, casse sensible)
    alt: "Commanditaire K103.7 Radio Bingo",
    href: "https://k1037.com/radiobingo",
  },
  {
    id: "gabarit-1",
    alt: "Espace publicitaire disponible",
    href: "mailto:paskal.brochu@gmail.com",
    text: "Votre Logo ICI - Contactez Paskal a paskal.brochu@gmail.com",
    isPlaceholder: true,
  },
  {
    id: "gabarit-2",
    alt: "Espace publicitaire disponible",
    href: "mailto:paskal.brochu@gmail.com",
    text: "Votre Logo ICI - Contactez Paskal a paskal.brochu@gmail.com",
    isPlaceholder: true,
  },
  {
    id: "gabarit-3",
    alt: "Espace publicitaire disponible",
    href: "mailto:paskal.brochu@gmail.com",
    text: "Votre Logo ICI - Contactez Paskal a paskal.brochu@gmail.com",
    isPlaceholder: true,
  },
];

// Rendu d'une seule carte publicitaire (logo ou gabarit texte).
function AdCard({ ad }: { ad: Ad }) {
  return (
    <a
      href={ad.href}
      target={ad.isPlaceholder ? "_self" : "_blank"}
      rel="noopener noreferrer"
      title={ad.alt}
      className={
        "flex items-center justify-center shrink-0 h-12 px-3 mx-2 rounded-lg transition-transform hover:scale-[1.03] " +
        (ad.isPlaceholder
          ? "border border-dashed border-slate-500/70 text-[11px] text-slate-300 bg-slate-800/40 max-w-[260px] text-center leading-tight"
          : "bg-white/5")
      }
    >
      {ad.imageSrc ? (
        <img src={ad.imageSrc} alt={ad.alt} className="h-10 w-auto object-contain" />
      ) : (
        <span>{ad.text}</span>
      )}
    </a>
  );
}

export default function AdCarousel() {
  const shouldScroll = ADS.length > SCROLL_THRESHOLD;

  // Mode STATIQUE : on centre les pubs, pas d'animation.
  if (!shouldScroll) {
    return (
      <div className="w-full overflow-hidden">
        <div className="flex items-center justify-center flex-wrap gap-1 py-1">
          {ADS.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      </div>
    );
  }

  // Mode DEFILANT : on duplique la liste pour une boucle continue sans trou.
  // La classe "ad-ticker" est definie dans index.css (@keyframes ticker).
  return (
    <div className="w-full overflow-hidden ad-ticker-mask">
      <div className="ad-ticker flex items-center w-max">
        {ADS.map((ad) => (
          <AdCard key={`a-${ad.id}`} ad={ad} />
        ))}
        {/* copie pour la boucle infinie */}
        {ADS.map((ad) => (
          <AdCard key={`b-${ad.id}`} ad={ad} />
        ))}
      </div>
    </div>
  );
}
