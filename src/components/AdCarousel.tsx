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
//
// UNIFORMITE DES LOGOS :
//   Meme boite pour tous (CARD_H x CARD_W) + object-contain -> chaque logo grossit
//   au max qui rentre, sans deformation. Pour que ca paraisse uniforme, les FICHIERS
//   doivent etre detoures (sans grosse marge morte) : un logo perdu au milieu d'un
//   grand canevas noir paraitra petit meme si la tuile est pleine.
//
// RESPONSIVE : tailles en classes Tailwind responsives (mobile -> desktop).
//
// IMAGES : dans public/ (chemin absolu "/nom.ext"). Noms minuscules-tirets, SANS
// espace ni accent (Vercel = Linux, sensible a la casse). Lien possible vers un
// site, Instagram, Facebook, Google Maps ou tel:.

import { supabase } from "../lib/supabase";

// Enregistre un clic commanditaire (anonyme, fire-and-forget). Ne bloque JAMAIS
// la navigation : un clic non logge ne doit pas empecher l'ouverture du lien.
function recordClick(sponsorId: string) {
  try {
    supabase.from("sponsor_clicks").insert({ sponsor_id: sponsorId }).then(
      () => {},
      () => {},
    );
  } catch {
    /* jamais de crash */
  }
}

const SCROLL_THRESHOLD = 4;

// Texte du commanditaire CIGN-FM, decoupe en lignes lisibles.
const CIGN_LINE1 = "Commanditez une boule du Radio-Bingo de CIGN-FM";
const CIGN_LINE2 = "M. Luc Frechette, conseiller aux ventes";
const CIGN_PHONE = "819 804-0967";

// --- Dimensions communes (responsive) -----------------------------------
const CARD_H = "h-20 sm:h-24";                 // hauteur IDENTIQUE pour tous
const CARD_W = "w-52 sm:w-64 md:w-72";         // largeur standard (logos / gabarit)
const CARD_W_CIGN = "w-72 sm:w-80 md:w-[22rem]"; // CIGN : a peine plus large (texte)
const CARD_BASE =
  "flex items-center justify-center shrink-0 mx-2 rounded-lg overflow-hidden transition-transform hover:scale-[1.02]";

// "bg" optionnel sur les logos : fond de la tuile (defaut bg-white).
// Fond SOMBRE pour les logos a fond sombre (PMF, St-Michel, ProGym, Playground)
// afin qu'ils s'integrent sans cadre blanc. Fond BLANC pour les logos clairs.
type Promo =
  | { id: string; kind: "logo"; imageSrc: string; alt: string; href: string; bg?: string }
  | { id: string; kind: "placeholder"; text: string; alt: string; href: string }
  | { id: string; kind: "cign"; logoSrc: string; alt: string; href: string };

// 9 panneaux : K103.7 + 5 commanditaires + 1 gabarit libre + 2 CIGN-FM.
const PROMOS: Promo[] = [
  { id: "k1037", kind: "logo", imageSrc: "/sponsor-k1037.jpg", alt: "K103.7 Radio Bingo", href: "https://k1037.com/radiobingo/" },
  { id: "pmf", kind: "logo", imageSrc: "/sponsor-pmf.png", alt: "PMF - Boîte de nuit / Salle de spectacle", href: "https://www.instagram.com/pmfnightclub/", bg: "bg-black" },
  { id: "cign-1", kind: "cign", logoSrc: "/cign-fm-967.png", alt: "CIGN-FM 96.7 Radio-Bingo", href: "tel:+18198040967" },
  { id: "services-sl", kind: "logo", imageSrc: "/sponsor-services-sl.jpg", alt: "Services S&L - Financement Crédit-bail", href: "https://www.facebook.com/paskalfinancement" },
  { id: "st-michel", kind: "logo", imageSrc: "/sponsor-st-michel.jpg", alt: "Café St-Michel - Bar / Resto", href: "https://www.facebook.com/cafestmichel", bg: "bg-black" },
  { id: "cign-2", kind: "cign", logoSrc: "/cign-fm-967.png", alt: "CIGN-FM 96.7 Radio-Bingo", href: "tel:+18198040967" },
  { id: "progym", kind: "logo", imageSrc: "/sponsor-progym.webp", alt: "ProGym - Centre d'entraînement", href: "https://www.progym.ca/", bg: "bg-black" },
  { id: "playground", kind: "logo", imageSrc: "/sponsor-playground.webp", alt: "Playground Casino", href: "https://www.playground.ca/", bg: "bg-black" },
  { id: "libre-1", kind: "placeholder", text: "Votre Logo ICI - Contactez Paskal à paskal.brochu@gmail.com", alt: "Espace publicitaire disponible", href: "mailto:paskal.brochu@gmail.com" },
];

function PromoCard({ promo }: { promo: Promo }) {
  if (promo.kind === "logo") {
    // p-1.5/p-2 = petite marge interne ; img h-full w-full + object-contain -> remplit
    // la boite au max sans deformer (le detourage du fichier fait le reste).
    return (
      <a
        href={promo.href}
        target="_blank"
        rel="noopener noreferrer"
        title={promo.alt}
        onClick={() => recordClick(promo.id)}
        className={`${CARD_BASE} ${CARD_H} ${CARD_W} p-1.5 sm:p-2 ${promo.bg ?? "bg-white"}`}
      >
        <img src={promo.imageSrc} alt={promo.alt} className="h-full w-full object-contain" />
      </a>
    );
  }

  if (promo.kind === "cign") {
    return (
      <a href={promo.href} onClick={() => recordClick(promo.id)} title={promo.alt} className={`${CARD_BASE} ${CARD_H} ${CARD_W_CIGN} bg-white`}>
        <div className="flex flex-col items-center justify-center gap-0.5 w-full h-full text-center px-2 font-sans leading-tight">
          <img src={promo.logoSrc} alt={promo.alt} className="h-5 sm:h-6 w-auto object-contain" />
          <span className="text-[9px] sm:text-[10px] font-bold text-black">{CIGN_LINE1}</span>
          <span className="text-[9px] sm:text-[10px] text-slate-800">{CIGN_LINE2}</span>
          <span className="text-sm sm:text-base font-black tracking-wide text-black">{CIGN_PHONE}</span>
        </div>
      </a>
    );
  }

  // placeholder (gabarit "Votre Logo ICI")
  return (
    <a
      href={promo.href}
      onClick={() => recordClick(promo.id)}
      title={promo.alt}
      className={`${CARD_BASE} ${CARD_H} ${CARD_W} px-3 border border-dashed border-slate-500/70 bg-slate-800/40 text-[10px] sm:text-[11px] text-slate-300 text-center leading-tight`}
    >
      <span>{promo.text}</span>
    </a>
  );
}

export default function AdCarousel() {
  const shouldScroll = PROMOS.length > SCROLL_THRESHOLD;

  // Conteneur a HAUTEUR FIXE (responsive) : la bande ne peut jamais collapser.
  return (
    <div className="w-full h-24 sm:h-28 overflow-hidden flex items-center">
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
