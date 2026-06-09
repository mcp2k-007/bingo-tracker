// AdCarousel.tsx
// Banniere de commanditaires (defilante).
//
// !!! IMPORTANT - BLOQUEURS DE PUB !!!
// On EVITE tout nom de classe/id contenant "ad", "ads", "banner", "sponsor",
// car uBlock/AdGuard cachent ces elements automatiquement (filtres cosmetiques).
// -> classe d'animation NEUTRE : "mq-track" (definie dans index.css).
//
// - <= SCROLL_THRESHOLD panneaux : affichage STATIQUE centre.
// - >  SCROLL_THRESHOLD panneaux : defilement auto droite -> gauche, boucle continue.

const SCROLL_THRESHOLD = 4;

// Texte du commanditaire CIGN-FM, decoupe en lignes lisibles.
const CIGN_LINE1 = "Commanditez une boule du Radio-Bingo de CIGN-FM";
const CIGN_LINE2 = "M. Luc Frechette, conseiller aux ventes";
const CIGN_PHONE = "819 804-0967";

type Promo =
  | { id: string; kind: "logo"; imageSrc: string; alt: string; href: string }
  | { id: string; kind: "placeholder"; text: string; alt: string; href: string }
  | { id: string; kind: "cign"; logoSrc: string; alt: string; href: string };

// 8 panneaux : 1 K103.7 + 5 gabarits libres + 2 CIGN-FM (melanges au hasard).
const PROMOS: Promo[] = [
  { id: "k1037", kind: "logo", imageSrc: "/sponsor-k1037.jpg", alt: "K103.7 Radio Bingo", href: "https://k1037.com/radiobingo/" },
  { id: "libre-1", kind: "placeholder", text: "Votre Logo ICI - Contactez Paskal à paskal.brochu@gmail.com", alt: "Espace publicitaire disponible", href: "mailto:paskal.brochu@gmail.com" },
  { id: "cign-1", kind: "cign", logoSrc: "/cign-fm-967.png", alt: "CIGN-FM 96.7 Radio-Bingo", href: "tel:+18198040967" },
  { id: "libre-2", kind: "placeholder", text: "Votre Logo ICI - Contactez Paskal à paskal.brochu@gmail.com", alt: "Espace publicitaire disponible", href: "mailto:paskal.brochu@gmail.com" },
  { id: "libre-3", kind: "placeholder", text: "Votre Logo ICI - Contactez Paskal à paskal.brochu@gmail.com", alt: "Espace publicitaire disponible", href: "mailto:paskal.brochu@gmail.com" },
  { id: "cign-2", kind: "cign", logoSrc: "/cign-fm-967.png", alt: "CIGN-FM 96.7 Radio-Bingo", href: "tel:+18198040967" },
  { id: "libre-4", kind: "placeholder", text: "Votre Logo ICI - Contactez Paskal à paskal.brochu@gmail.com", alt: "Espace publicitaire disponible", href: "mailto:paskal.brochu@gmail.com" },
  { id: "libre-5", kind: "placeholder", text: "Votre Logo ICI - Contactez Paskal à paskal.brochu@gmail.com", alt: "Espace publicitaire disponible", href: "mailto:paskal.brochu@gmail.com" },
];

// Hauteur uniforme (h-24) pour tous. Largeur : standard (w-72), CIGN plus large (w-96)
// pour laisser respirer le texte du commanditaire.
function PromoCard({ promo }: { promo: Promo }) {
  const base =
    "flex items-center justify-center shrink-0 h-24 px-3 mx-2 rounded-lg overflow-hidden transition-transform hover:scale-[1.02]";

  if (promo.kind === "logo") {
    return (
      <a href={promo.href} target="_blank" rel="noopener noreferrer" title={promo.alt} className={base + " w-72 bg-white"}>
        <img src={promo.imageSrc} alt={promo.alt} className="max-h-16 w-auto object-contain" />
      </a>
    );
  }

  if (promo.kind === "cign") {
    return (
      <a href={promo.href} title={promo.alt} className={base + " w-96 bg-white"}>
        <div className="flex flex-col items-center justify-center gap-0.5 w-full h-full text-center px-3 font-sans">
          <img src={promo.logoSrc} alt={promo.alt} className="h-7 w-auto object-contain mb-0.5" />
          <span className="text-[11px] leading-snug font-bold text-black">{CIGN_LINE1}</span>
          <span className="text-[11px] leading-snug text-slate-800">{CIGN_LINE2}</span>
          <span className="text-base font-black tracking-wide text-black">{CIGN_PHONE}</span>
        </div>
      </a>
    );
  }

  // placeholder (gabarit "Votre Logo ICI")
  return (
    <a
      href={promo.href}
      title={promo.alt}
      className={base + " w-72 border border-dashed border-slate-500/70 bg-slate-800/40 text-[11px] text-slate-300 text-center leading-tight"}
    >
      <span>{promo.text}</span>
    </a>
  );
}

export default function AdCarousel() {
  const shouldScroll = PROMOS.length > SCROLL_THRESHOLD;

  // Conteneur a HAUTEUR FIXE : la bande ne peut jamais collapser.
  return (
    <div className="w-full h-28 overflow-hidden flex items-center">
      {shouldScroll ? (
        // Defilement : liste dupliquee pour une boucle continue sans trou.
        // .mq-track est defini dans index.css (@keyframes ticker, droite -> gauche).
        <div className="mq-track flex items-center w-max">
          {PROMOS.map((p) => (
            <PromoCard key={`a-${p.id}`} promo={p} />
          ))}
          {PROMOS.map((p) => (
            <PromoCard key={`b-${p.id}`} promo={p} />
          ))}
        </div>
      ) : (
        // Statique : panneaux centres, sans animation.
        <div className="flex items-center justify-center flex-wrap gap-1 w-full">
          {PROMOS.map((p) => (
            <PromoCard key={p.id} promo={p} />
          ))}
        </div>
      )}
    </div>
  );
}
