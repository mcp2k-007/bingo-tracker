# 🎯 BRIEF — POINT DE TRANSFERT
## D•IA•NE Bingo Tracker v1.2 — (Phase 3.6 COMPLÈTE + Bandeau commanditaires)

> **Document de reprise / handoff.** Colle ce fichier au début d'une nouvelle session pour repartir sans rien perdre.
> **Dernière mise à jour :** samedi 14 juin 2026 — *fin de la session « Phase 3.6 (3/3) géoloc + exports, et refonte du bandeau commanditaires (AdCarousel) ».*

---

## 1. STATUT EN UN COUP D'OEIL

- ✅ **v1.2 complète et déployée** sur Vercel + GitHub (Diane + spectateurs + /stats + /confidentialite).
- ✅ **Phase 3.6 — analytics commanditaires : COMPLÈTE (3/3).**
  - Tracking sessions + dashboard `/stats` (sessions, pic simultané, durée, spectateurs-minutes, par jour). *(parties 1-2, sessions précédentes)*
  - 🆕 **Géolocalisation** (ville/région/pays) conditionnée au consentement Loi 25.
  - 🆕 **Exports Excel + PDF** des rapports commanditaires dans `/stats`.
- ✅ **Bandeau commanditaires (AdCarousel) refait** : 5 commanditaires réels ajoutés, logos détourés/uniformisés, responsive.
- 🟡 **Loi 25** : reste à ajouter le paragraphe de divulgation géoloc dans `Confidentialite.tsx` *(fichier pas encore vu par Claude)*.
- ⏭️ **À venir** : nouveau logo Playground (à remplacer), accentuation `SaveGameModal.tsx`, v1.3 auth, v1.4 reconnaissance vocale.

---

## 2. IDENTITÉ & STACK

- **Nom officiel (FINAL) :** D•IA•NE Bingo Tracker v1.2
  - Le `•` (puce) se rend via `&bull;` en JSX et `\u2022` dans les chaines texte (source ASCII).
- **Type :** PWA bingo en temps réel, déployée en continu sur Vercel via GitHub.
- **Stack :** React + Vite + TypeScript + Tailwind CSS v3 + Supabase (Realtime + tables persistantes) + react-router-dom.
- **Libs ajoutées (Phase 3.6 exports) :** `xlsx` (SheetJS, via CDN), `jspdf`, `jspdf-autotable`.
- **Quatre routes :**
  - `/` → **`App.tsx`** = console animatrice (**Diane**, iPad / Safari)
  - `/live` → **`LiveView.tsx`** = vue spectateurs lecture seule (Android / Chrome)
  - `/stats` → **`Stats.tsx`** = dashboard analytics commanditaires (protégé par mot de passe)
  - `/confidentialite` → **`Confidentialite.tsx`** = politique de confidentialité (Loi 25)

---

## 3. RESSOURCES CLÉS (verbatim)

| Élément | Valeur |
|---|---|
| GitHub | `github.com/mcp2k-007/bingo-tracker` |
| App live (Diane) | `https://bingo-tracker-ten.vercel.app` |
| Vue spectateurs | `https://bingo-tracker-ten.vercel.app/live` |
| Dashboard stats | `https://bingo-tracker-ten.vercel.app/stats` |
| Confidentialité | `https://bingo-tracker-ten.vercel.app/confidentialite` |
| Supabase URL | `https://mcrglhtdxxugilojqgff.supabase.co` |
| Supabase ref | `mcrglhtdxxugilojqgff` |
| Variables env | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_STATS_PASSWORD` (`.env.local` + Vercel) |
| Dossier projet | `$HOME\Documents\bingo-tracker` (Windows, PowerShell) |
| Tables Supabase | `game_state` (jeu, temps réel) + `viewer_sessions` (analytics + géoloc) |
| Clés stockage navigateur | `localStorage: diane_consent_loi25_v1` (consentement) · `sessionStorage: stats_authed` (déverrouillage /stats) |
| Flux radio CIGN | `https://arcq.streamb.live/SB00259` (HTTPS natif, en dur dans `useLiveRadio.ts`) |

---

## 4. CONVENTIONS DE DÉPLOIEMENT (à respecter toujours)

1. **Toujours `npm run build` AVANT de pousser** (`tsc -b && vite build`).
2. **Séquence complète (depuis le dossier du projet) :**
   ```
   cd $HOME\Documents\bingo-tracker
   npm run build
   git add .
   git commit -m "message"
   git push
   ```
   ⚠️ **`npm run dev` / `build` doivent être lancés DEPUIS le dossier du projet**, pas depuis `C:\Users\Paskal` (sinon `ENOENT package.json`).
3. **`npm run build` NE SERT PAS l'app** → pour voir en local : **`npm run dev`** (localhost:5173).
4. **Service worker PWA périmé** → après déploiement : `Ctrl+Shift+R`, ou DevTools → Application → Service Workers → **Unregister** + **Clear site data**.
5. **Vercel = Linux, sensible à la casse** : noms de fichiers (et d'images) doivent matcher EXACTEMENT les imports (ex. `Stats.tsx`, `sponsor-pmf.png`).
6. **Code & commentaires SANS accents**. **Texte AFFICHÉ = accentué** (UTF-8 obligatoire à la sauvegarde — VS Code « UTF-8 » en bas à droite).
7. **Ne jamais réécrire un fichier sans l'avoir vu.**

---

## 5. ARCHITECTURE DES FICHIERS (carte actuelle)

| Fichier | Destination | Rôle |
|---|---|---|
| `main.tsx` | `src/` | Routing (/ /live /stats /confidentialite) |
| `App.tsx` | `src/` | Console Diane |
| `index.css` | `src/` | Styles globaux + @keyframes (dont `.mq-track`) |
| `LiveView.tsx` | `src/pages/` | Vue spectateurs + tracking + bannière consentement |
| `Stats.tsx` | `src/pages/` | Dashboard analytics + **section géo + exports Excel/PDF** 🆕 |
| `Confidentialite.tsx` | `src/pages/` | Politique de confidentialité *(divulgation géoloc à ajouter)* |
| `BingoBoard.tsx` | `src/components/` | Grille cliquable de Diane |
| `HistoryTicker.tsx` | `src/components/` | Bandeau historique des boules |
| `Footer.tsx` | `src/components/` | Pied de page crédit |
| `AdCarousel.tsx` | `src/components/` | **Bandeau commanditaires (refait cette session)** 🆕 |
| `TerminalClock.tsx` | `src/components/` | Horloge « xx h xx » 24h |
| `SaveGameModal.tsx` | `src/components/` | Modale de sauvegarde *(à accentuer — non vu par Claude)* |
| `ConsentBanner.tsx` | `src/components/` | Bannière de consentement Loi 25 |
| `useViewerSession.ts` | `src/hooks/` | Tracking session + **géoloc consentie** 🆕 |
| `useConsent.ts` | `src/hooks/` | Gestion consentement Loi 25 (`getConsent()` synchrone) |
| `useLiveRadio.ts` | `src/hooks/` | Audio CIGN-FM 96.7 |
| `useLiveAudience.ts` | `src/hooks/` | Compteur d'audience éphémère (Presence) |
| `useGameState.ts` / `useRealtimeGame.ts` | `src/hooks/` | État du jeu / temps réel |
| `bingoLogic.ts` / `exportGame.ts` / `supabase.ts` / `types.ts` | `src/lib/`, `src/` | Logique + export TXT/JSON + client + types |
| `viewer_sessions.sql` | `db/` | Schéma SQL (table + **colonnes géo** city/region/country) 🆕 |
| **Images commanditaires** | `public/` | `sponsor-k1037.jpg`, `cign-fm-967.png`, `sponsor-pmf.png`, `sponsor-st-michel.jpg`, `sponsor-services-sl.jpg`, `sponsor-progym.webp`, `sponsor-playground.webp` 🆕 |

---

## 6. FAIT CETTE SESSION (résumé)

### A. Phase 3.6 (3/3) — Géolocalisation
- **SQL** : `ALTER TABLE viewer_sessions ADD COLUMN city / region / country` (idempotent). La policy RLS `anon update` existante couvre déjà ces colonnes.
- **`useViewerSession.ts`** : capture géo **paresseuse, gated, défensive** :
  - Déclenchée seulement si `getConsent() === 'granted'` (gate Loi 25).
  - **Jamais l'IP brute** — seulement ville/région/pays.
  - Re-vérifiée à chaque battement (20 s) tant que pas captée → gère le cas « consentement donné après le montage ».
  - **Bornée à 3 essais** (`GEO_MAX_ATTEMPTS`) pour ne pas spammer si l'API bloque.
  - **Fournisseur : `geojs.io` (primaire) + `freeipapi.com` (secours).** *(L'ancien `ipwho.is` renvoyait 403 dans le navigateur → remplacé.)*

### B. Phase 3.6 (3/3) — Exports Excel + PDF
- **`Stats.tsx`** : nouvelle section **« Portée géographique »** (KPIs villes/régions/sessions géolocalisées + tableau Ville/Région/Pays) + **boutons Excel et PDF**.
- **Excel (SheetJS)** : classeur 3 feuilles → *Résumé* (KPIs), *Par jour*, *Géographie*.
- **PDF (jsPDF + autotable)** : rapport 1 page → en-tête D•IA•NE + KPIs + tableau par jour + tableau géo.
- **Fichiers générés** : `DIANE-stats-AAAA-MM-JJ.xlsx` / `.pdf`.
- **Installation libs :**
  ```
  npm install --save https://cdn.sheetjs.com/xlsx-latest/xlsx-latest.tgz
  npm install jspdf jspdf-autotable
  ```
- **Imports :** `import * as XLSX from 'xlsx'` · `import { jsPDF } from 'jspdf'` · `import { autoTable } from 'jspdf-autotable'` (API moderne `autoTable(doc, {...})`, PAS `doc.autoTable()`).

### C. Bandeau commanditaires (AdCarousel) — voir section 8.

---

## 7. PHASE 3.6 — DÉTAILS TECHNIQUES (état final)

**Table `viewer_sessions`** : `id, session_id, started_at, last_seen_at, user_agent, referrer, city, region, country`.
- 3 index (started_at, last_seen_at, session_id) + 3 policies RLS anon (insert/update/select), `using(true)` (communautaire).

**Dashboard `/stats`** :
- Barrière mot de passe (`VITE_STATS_PASSWORD`, `sessionStorage`).
- Regroupe par `session_id` (fusionne doublons StrictMode), filtre sessions < 5 s.
- Pic simultané = sweep-line sur les intervalles `[started_at, last_seen_at]`.
- Géo : n'affiche que les sessions ayant une géo (= consentement accordé).

**Caveat PDF** : le `•` passe par `\u2022` ; police Helvetica de jsPDF gère les accents Latin-1 + la puce. Si la puce sortait croche → swap pour `D-IA-NE` (trivial).

---

## 8. BANDEAU COMMANDITAIRES — `AdCarousel.tsx` (refait cette session)

**9 panneaux**, ordre : K103.7 → PMF → CIGN → Services S&L → St-Michel → CIGN → ProGym → Playground → « Votre Logo ICI ».

| Commanditaire | Lien | Image | Fond tuile |
|---|---|---|---|
| K103.7 | `https://k1037.com/radiobingo/` | `sponsor-k1037.jpg` | blanc |
| PMF | `https://www.instagram.com/pmfnightclub/` | `sponsor-pmf.png` | `bg-black` |
| Café St-Michel (Bar/Resto) | `https://www.facebook.com/cafestmichel` | `sponsor-st-michel.jpg` | `bg-black` |
| Services S&L | `https://www.facebook.com/paskalfinancement` | `sponsor-services-sl.jpg` | blanc |
| ProGym | `https://www.progym.ca/` | `sponsor-progym.webp` | `bg-black` |
| Playground Casino | `https://www.playground.ca/` | `sponsor-playground.webp` | `bg-[#23323d]` (bleu nuit assorti) |
| CIGN-FM (x2) | `tel:+18198040967` | `cign-fm-967.png` | blanc + texte |
| Gabarit libre (x1) | `mailto:paskal.brochu@gmail.com` | — | pointillé |

**Règles de rendu (uniformité + responsive) :**
- **Même boîte pour tous** : `CARD_H = h-20 sm:h-24`, `CARD_W = w-52 sm:w-64 md:w-72`. CIGN un peu plus large : `w-72 sm:w-80 md:w-[22rem]`.
- Logo en `h-full w-full object-contain`, padding `p-1.5 sm:p-2`.
- `bg?` optionnel par logo (sombre pour logos sombres, blanc pour logos clairs, hex pour Playground).
- **Anti-bloqueurs de pub** : AUCUN nom de classe/id avec « ad/ads/banner/sponsor » → classe d'anim **`.mq-track`** (dans `index.css`).
- Liens externes en `target="_blank" rel="noopener noreferrer"`.
- Défile si `> SCROLL_THRESHOLD (4)` panneaux (liste dupliquée pour boucle continue).

---

## 9. CONVENTIONS IMAGES / LOGOS (mémo)

**Le facteur #1 pour qu'un logo « remplisse sa case »** = **détourer la marge morte** (le logo doit remplir son propre fichier). `object-contain` fait rentrer tout le canevas : un logo perdu au milieu d'un grand fond noir paraît minuscule. → **Envoyer les logos bruts à Claude qui détoure automatiquement (bbox).**

**Format idéal à demander aux commanditaires :**
- **PNG transparent** (idéal) ou **SVG** (vectoriel, le top).
- Détouré serré (zéro marge morte).
- Horizontal, ratio ~3:1 à 1:1.
- **~800-1000 px** sur le grand côté, **sRGB**, **< ~150 Ko**.
- Lisible en petit (formes simples, bon contraste).
- ⚠️ Convertir en PNG **n'enlève PAS** le fond. Transparence = étape de détourage de fond séparée (faisable par Claude pour un fond uni).

**Faits cette session :** PMF + ProGym + Playground détourés (marge morte enlevée) ; St-Michel = enseigne détourée d'une photo-collage ; Services déjà serré.

---

## 10. PIÈGES & LEÇONS (référence rapide)

- **`ipwho.is` → 403 dans le navigateur** → utiliser `geojs.io` (+ `freeipapi.com` secours).
- **`npm run dev/build`** : à lancer depuis le dossier projet, sinon `ENOENT package.json`.
- **SheetJS `xlsx`** : le registre npm est gelé à 0.18.5 (déprécié) → installer via **CDN SheetJS**.
- **`jspdf-autotable`** : import nommé `autoTable(doc, {...})`, pas l'ancien `doc.autoTable()`.
- **Logos qui paraissent petits** : marge morte « cuite » dans le fichier → **détourer**.
- **Tailwind valeurs arbitraires** (`bg-[#23323d]`, `w-[22rem]`) : OK en v3 standard.
- `npm run build` ≠ serveur → `npm run dev` pour voir en local.
- SW PWA périmé → Unregister + Clear site data + `Ctrl+Shift+R`.
- StrictMode (dev) double le tracking → géré par regroupement `session_id` + filtre < 5 s.
- Vercel/Linux = sensible à la casse (fichiers + images).
- UTF-8 obligatoire à la sauvegarde (texte accentué).

---

## 11. EN ATTENTE / ROADMAP

- ⏭️ **Loi 25 — divulgation géoloc** : ajouter un paragraphe dans `Confidentialite.tsx` (position approximative ville/région déduite par service tiers `geojs.io`, IP jamais conservée). *(Claude doit voir le fichier avant.)*
- ⏭️ **Nouveau logo Playground** : Paskal va le fournir → remplacer `sponsor-playground.webp`, ajuster la couleur de tuile si le fond change.
- **`SaveGameModal.tsx`** : à accentuer (non fourni à Claude).
- **Politique de confidentialité** : faire réviser le texte (Loi 25 / CAI).
- **Métriques optionnelles** (par valeur/risque) : engagement audio CIGN (anonyme), attribution UTM, type d'appareil + langue, nouveau vs récurrent.
- **Microsoft Clarity** (optionnel) : Project ID non fourni.
- **Droits de rediffusion CIGN** : à confirmer avec M. Luc Frechette avant usage commercial du flux.
- **v1.3** : authentification utilisateurs payants (Supabase Auth) — sécurise aussi vraiment `/stats`.
- **v1.4** : reconnaissance vocale — coche auto des boules + déclencheurs mots-clés. Se branche sur `bingoLogic.ts`.

---

## 12. MOTIFS OFFICIELS DE BINGO

Bingo régulier (4 coins / ligne / diagonale) · Lettre H (col B + col I + rangée du milieu, centre libre inclus) · Carte pleine (jackpot 4000-5000 $) · Consolation (~1000 $).
**Logique gagnante** = compte les cases **BLANCHES (non cochées)** restantes du motif courant (`bingoLogic.ts`).

---

## 13. CONTACTS & IDENTIFIANTS

- **Diane Brochu** — animatrice du bingo, Sherbrooke. Teste sur iPad Safari.
- **Paskal Brochu** — dev / opérateur. `paskal.brochu@gmail.com`.
- **CIGN-FM 96.7** (Coaticook / Estrie) — `cignfm.ca` — flux `arcq.streamb.live/SB00259`.
  - Commanditaire / contact ventes : **M. Luc Frechette** — **819 804-0967**.
- **K103.7** (Kahnawake) — `k1037.com/radiobingo/`.
- **Commanditaires actifs au bandeau** : PMF (IG), Café St-Michel (FB), Services S&L (FB), ProGym (progym.ca), Playground Casino (playground.ca).

---

*Fin du brief. Prochaine session : divulgation géoloc Loi 25 + nouveau logo Playground 🎰 — et que les cases blanches tombent vite ! 🔴🎲*
