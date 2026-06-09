# 🎯 BRIEF — POINT DE TRANSFERT
## D•IA•NE Bingo Tracker v1.2 — (Phase 3.6 en cours)

> **Document de reprise / handoff.** Colle ce fichier au début d'une nouvelle session pour repartir sans rien perdre.
> **Dernière mise à jour :** lundi 9 juin 2026 — *fin de la session « UI + Phase 3.6 analytics + Loi 25 + accentuation ».*

---

## 1. STATUT EN UN COUP D'OEIL

- ✅ **v1.2 complète et déployée** sur Vercel + GitHub. App fonctionnelle (Diane + spectateurs).
- ✅ **Dossier audio CIGN : RÉSOLU et confirmé** (URL trouvée en dur dans le code source du lecteur).
- ✅ **Ajustements UI faits** : header réordonné, horloge 24h, contour noir BINGO, infobulles.
- ✅ **Ménage `dev-dist/`** sorti du suivi Git.
- 🟡 **Phase 3.6 (analytics commanditaires)** : tracking + dashboard `/stats` **FAITS et fonctionnels**. Reste : géoloc + exports Excel/PDF.
- ✅ **Loi 25** : bannière de consentement + page `/confidentialite` **bâties**. (Texte de la politique = modèle à faire réviser.)
- ✅ **Accentuation** : tout le texte affiché de l'app est maintenant en français accentué.
- ⏭️ **Prochaine étape : la GÉOLOC** (IP → ville/région), conditionnée au consentement.

---

## 2. IDENTITÉ & STACK

- **Nom officiel (FINAL) :** D•IA•NE Bingo Tracker v1.2
  - Le `•` (puce) se rend via `&bull;` en JSX et `\u2022` dans les chaines texte (pour garder la source ASCII).
- **Type :** PWA bingo en temps réel, déployée en continu sur Vercel via GitHub.
- **Stack :** React + Vite + TypeScript + Tailwind CSS v3 + Supabase (Realtime + table persistante) + react-router-dom.
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
| Client Supabase | `src/lib/supabase.ts` (exporte `supabase`, type `GameStateRow`, supabase-js v2) |
| Variables env | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, **`VITE_STATS_PASSWORD`** (`.env.local` + Vercel) |
| Dossier projet | `$HOME\Documents\bingo-tracker` (Windows, PowerShell) |
| Tables Supabase | `game_state` (état du jeu, temps réel) + **`viewer_sessions`** (analytics, nouveau) |
| Clés stockage navigateur | `localStorage: diane_consent_loi25_v1` (consentement) · `sessionStorage: stats_authed` (déverrouillage /stats) |

---

## 4. CONVENTIONS DE DÉPLOIEMENT (à respecter toujours)

1. **Toujours `npm run build` AVANT de pousser** — build 🟢 (`tsc -b && vite build`, ~80 modules).
2. **Séquence complète :**
   ```
   cd $HOME\Documents\bingo-tracker
   npm run build
   git add .
   git commit -m "message"
   git push
   ```
3. **Pièges déjà rencontrés (IMPORTANT) :**
   - **`npm run build` NE SERT PAS l'app** → pour voir en local, utiliser **`npm run dev`** (localhost:5173). *(Symptôme classique : page blanche + `ERR_CONNECTION_REFUSED` sur `@vite/client`, `/src/main.tsx`, etc. = le serveur dev n'est pas démarré.)*
   - **Service worker PWA périmé** garde l'ancienne version en cache → après déploiement : **`Ctrl+Shift+R`**, ou DevTools → Application → Service Workers → **Unregister** + **Clear site data**.
   - `git push` seul dit « Everything up-to-date » sans `add` + `commit`.
   - **Vercel = Linux, sensible à la casse** : les noms de fichiers doivent matcher EXACTEMENT les imports (ex. `Stats.tsx` avec S majuscule).
   - PowerShell `>>` peut corrompre un fichier (UTF-16/BOM) → utiliser **`Add-Content`** ou l'éditeur pour modifier `.gitignore`.
4. **Code & commentaires sans accents** (convention interne). **Texte AFFICHÉ = accentué** (depuis cette session, pour le professionnalisme — safe en UTF-8).
   - ⚠️ **Garder les fichiers en UTF-8** au moment de sauvegarder (VS Code en bas à droite = « UTF-8 »). Symptôme de mauvais encodage : « VÃ©rification », « DonnÃ©es ».
5. **Ne jamais réécrire un fichier sans l'avoir vu.**

---

## 5. ARCHITECTURE DES FICHIERS (carte actuelle)

| Fichier | Destination | Rôle |
|---|---|---|
| `main.tsx` | `src/` | Routing (/ /live /stats /confidentialite) |
| `App.tsx` | `src/` | Console Diane |
| `index.css` | `src/` | Styles globaux + @keyframes |
| `LiveView.tsx` | `src/pages/` | Vue spectateurs + tracking + bannière consentement |
| `Stats.tsx` | `src/pages/` | Dashboard analytics (NOUVEAU) |
| `Confidentialite.tsx` | `src/pages/` | Politique de confidentialité (NOUVEAU) |
| `BingoBoard.tsx` | `src/components/` | Grille cliquable de Diane (contour noir BINGO) |
| `BingoCell.tsx` | `src/components/` | Cellule individuelle *(non vu par Claude)* |
| `HistoryTicker.tsx` | `src/components/` | Bandeau historique des boules |
| `Footer.tsx` | `src/components/` | Pied de page crédit |
| `AdCarousel.tsx` | `src/components/` | Bannière commanditaires défilante |
| `TerminalClock.tsx` | `src/components/` | Horloge « xx h xx » 24h |
| `SaveGameModal.tsx` | `src/components/` | Modale de sauvegarde *(non vu par Claude — à accentuer)* |
| `ConsentBanner.tsx` | `src/components/` | Bannière de consentement Loi 25 (NOUVEAU) |
| `useGameState.ts` | `src/hooks/` | État du jeu (Diane) *(non vu par Claude)* |
| `useRealtimeGame.ts` | `src/hooks/` | Abonnement temps réel (spectateurs) *(non vu)* |
| `useLiveRadio.ts` | `src/hooks/` | Audio CIGN-FM 96.7 |
| `useLiveAudience.ts` | `src/hooks/` | Compteur d'audience éphémère (Presence) |
| `useViewerSession.ts` | `src/hooks/` | Tracking session persistant (NOUVEAU) |
| `useConsent.ts` | `src/hooks/` | Gestion consentement Loi 25 (NOUVEAU) |
| `bingoLogic.ts` | `src/lib/` | COLUMNS, getLetterForNumber, logique cases blanches *(non vu)* |
| `exportGame.ts` | `src/lib/` | Export TXT + JSON |
| `supabase.ts` | `src/lib/` | Client Supabase *(non vu)* |
| `types.ts` | `src/` | Types (BingoCheck...) *(non vu)* |
| `viewer_sessions.sql` | `db/` (suggéré) | Schéma SQL de la table analytics (NOUVEAU) |

---

## 6. FAIT CETTE SESSION (résumé)

**Ajustements UI :**
- Header des 2 cartes réordonné : `[Horloge] [EN DIRECT] [Boule principale] [Sortis] [Restants]`.
- Horloge : format **« xx h xx »** (24h, sans « min »).
- Libellé central de Diane → **« Audiences: »** en gras (pastille verte + compteur conservés).
- **Boule principale ajoutée** au header de Diane (la plus récente : `drawnNumbersRecentFirst[0]`).
- **Contour noir gras** autour du B-I-N-G-O sur les 2 cartes : `rounded-xl border-2 sm:border-[3px] border-black p-1`.
- **Infobulles** (`title`) : Boule → « Boules en cours », Sortis → « Nombre de boules tirées », Restants → « Nombre de boules restantes », bandeau historique → « Historique des boules tirées ».
- Boule récente du footer alignée `bg-red-700` (clone de celle du header).

**Ménage :** `dev-dist/` ajouté au `.gitignore` + `git rm -r --cached dev-dist` (généré par vite-plugin-pwa, n'a plus besoin d'être suivi).

**Nom :** normalisé « D•IA•NE Bingo Tracker v1.2 » partout (corrigé v1.1 résiduel dans `main.tsx` + `exportGame.ts`; index.html + vite.config.ts gérés par Paskal).

**Accentuation :** tout le texte affiché (App, LiveView, Stats, HistoryTicker, export TXT, AdCarousel, Footer, ConsentBanner, Confidentialite) est passé en français accentué. *(Reste : `SaveGameModal.tsx` à accentuer — non fourni.)*

---

## 7. PHASE 3.6 — ANALYTICS COMMANDITAIRES (cœur de la session)

**Objectif :** chiffres concrets à vendre aux commanditaires (« vu par X spectateurs, pic de Y simultanés, Z minutes »).

**Table Supabase `viewer_sessions`** (créée, SQL dans `viewer_sessions.sql`) :
- Colonnes : `id (uuid)`, `session_id (text)`, `started_at`, `last_seen_at`, `user_agent`, `referrer`.
- 3 index (started_at, last_seen_at, session_id) + 3 policies RLS (anon : insert / update / select).
- ⚠️ RLS volontairement permissif (`using(true)`) — contexte communautaire. Vraie sécurité = Supabase Auth (v1.3).

**Hook `useViewerSession.ts`** (branché dans `/live` seulement) :
- INSERT une session au montage → récupère l'`id`.
- **Heartbeat** : UPDATE `last_seen_at` toutes les **20 s**. Durée = `last_seen_at - started_at`.
- Défensif (try/catch, jamais de crash). **Diane (`/`) ne track PAS** (animatrice ≠ spectatrice).

**Dashboard `/stats` (`Stats.tsx`)** :
- Barrière mot de passe (`VITE_STATS_PASSWORD`, mémorisé en `sessionStorage`).
- KPIs : **Sessions totales · Pic de simultanés (+ quand) · Durée moyenne · Spectateurs-minutes** + tableau **par jour**.
- **Regroupe par `session_id`** → fusionne les doublons StrictMode (dev). **Filtre les sessions < 5 s** (bounces / fantômes).
- Pic simultané = sweep-line sur les intervalles `[started_at, last_seen_at]`.

**Comportement connu (dev) :** StrictMode insère 2 lignes au même `session_id` (1 vivante + 1 fantôme durée 0). Le regroupement + filtre les neutralise. **La prod est propre** (pas de double montage).

**Note Vercel :** l'approche Supabase-maison **ne nécessite PAS Vercel Pro** (seuls les events de Vercel Analytics l'exigeraient).

---

## 8. LOI 25 — CONSENTEMENT (bâti cette session)

- **`useConsent.ts`** : source de vérité. `localStorage` clé `diane_consent_loi25_v1` → `granted` / `refused` / `null`. Expose **`getConsent()`** (lecture synchrone hors composant — c'est ce que la géoloc utilisera).
- **`ConsentBanner.tsx`** : bannière bas d'écran sur `/live`, boutons **Accepter / Refuser** de même importance (le refus ne bloque pas le bingo). S'auto-cache une fois le choix fait.
- **`Confidentialite.tsx`** (`/confidentialite`) : politique **(MODÈLE de départ — à faire réviser/valider Loi 25 / CAI)** + bouton « Réinitialiser mes préférences » (retrait du consentement → la bannière revient).
- **Logique de gate :** la bannière enregistre le choix ; la géoloc (prochaine étape) fera `if (getConsent() === 'granted')` avant de collecter quoi que ce soit de personnel.

---

## 9. DOSSIER AUDIO CIGN — RÉSOLU ✅

- **URL du flux (confirmée dans le code source du lecteur) :** `var stream = { mp3: "https://arcq.streamb.live/SB00259" }`
- HTTPS natif (plateforme ARCQ / StreamB) → **aucun proxy**. Codée dans `useLiveRadio.ts`.
- Hors de l'heure du bingo, le flux joue la programmation régulière de CIGN — normal.

---

## 10. PIÈGES & LEÇONS (référence rapide)

- `npm run build` ≠ serveur → `npm run dev` pour voir en local.
- Page blanche + `ERR_CONNECTION_REFUSED` = serveur dev pas démarré (souvent masqué par un SW périmé).
- SW PWA périmé → Unregister + Clear site data + `Ctrl+Shift+R`.
- StrictMode (dev) double le tracking → géré par regroupement `session_id` + filtre < 5 s.
- Vercel/Linux = sensible à la casse des noms de fichiers.
- UTF-8 obligatoire à la sauvegarde (texte accenté).
- PowerShell `>>` peut corrompre → `Add-Content`.

---

## 11. EN ATTENTE / ROADMAP

- ⏭️ **GÉOLOC (prochaine étape immédiate)** : ajouter colonnes `city`/`region` à `viewer_sessions`, capter via API IP tierce (ipapi.co…) **OU** côté serveur (en-têtes géo Vercel / Edge Function Supabase), **seulement si `getConsent() === 'granted'`**, puis afficher la portée géographique dans `/stats`.
- **Phase 3.6 — exports** : boutons **Excel (SheetJS) + PDF (jsPDF)** dans `/stats` pour les rapports commanditaires.
- **`SaveGameModal.tsx`** : à accentuer (non fourni à Claude).
- **Politique de confidentialité** : faire réviser le texte (Loi 25 / CAI).
- **Autres métriques discutées** (par valeur/risque) : ⭐ engagement audio (a-t-il écouté CIGN — anonyme, gros argument radio), ⭐ attribution UTM (zéro vie privée), type d'appareil + langue (anonyme), nouveau vs récurrent.
- **Microsoft Clarity** (optionnel, complément) : Project ID toujours non fourni.
- **Droits de rediffusion CIGN** : à confirmer avec M. Luc Frechette avant usage commercial du flux.
- **v1.3** : authentification utilisateurs payants (Supabase Auth) — sécurise aussi vraiment `/stats`.
- **v1.4** : reconnaissance vocale — coche auto des boules + déclencheurs mots-clés (« Pop-pop-pop BINGO »). Se branche sur `bingoLogic.ts` (comptage cases blanches).

---

## 12. MOTIFS OFFICIELS DE BINGO

Bingo régulier (4 coins / ligne / diagonale) · Lettre H (col B + col I + rangée du milieu, centre libre inclus) · Carte pleine (jackpot 4000-5000 $) · Consolation (~1000 $).
**Logique gagnante** = compte les cases **BLANCHES (non cochées)** restantes du motif courant (dans `bingoLogic.ts`).

---

## 13. CONTACTS & IDENTIFIANTS

- **Diane Brochu** — animatrice du bingo, Sherbrooke. Teste sur iPad Safari.
- **Paskal Brochu** — dev / opérateur. `paskal.brochu@gmail.com`.
- **CIGN-FM 96.7** (Coaticook / Estrie) — `cignfm.ca` — flux `arcq.streamb.live/SB00259`.
  - Commanditaire / contact ventes : **M. Luc Frechette** — **819 804-0967**.
- **K103.7** (Kahnawake) — `k1037.com/radiobingo/` — lié au Radio-Bingo (commanditaire/affiché).

---

*Fin du brief. Prochaine session : la géoloc 🌍 — et que les cases blanches tombent vite ! 🔴🎲*
