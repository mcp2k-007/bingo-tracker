# 🎯 BRIEF — POINT DE TRANSFERT
## D&bull;IA&bull;NE Bingo Tracker v1.2

> **Document de reprise / handoff.** Colle ce fichier au début d'une nouvelle session pour repartir sans rien perdre.
> **Dernière mise à jour :** dimanche 7 juin 2026 — *T-quelques heures avant le test en direct (16 h).*

---

## 1. STATUT EN UN COUP D'OEIL

- ✅ **v1.2 complète et déployée** sur Vercel. App fonctionnelle (Diane + spectateurs).
- 🔴 **Test en direct prévu aujourd'hui dimanche 16 h** avec Diane à Sherbrooke (tirage Radio-Bingo).
- 🎶 **Dossier audio CIGN : RÉSOLU** (voir section 6).
- 🧊 **Code gelé** avant le test — aucune modification recommandée d'ici 16 h.

---

## 2. IDENTITÉ & STACK

- **Nom officiel (FINAL) :** D&bull;IA&bull;NE Bingo Tracker v1.2
  - Le `&bull;` (puce) se rend via `&bull;` en JSX et `\u2022` dans les chaines texte (pour garder la source en ASCII).
- **Type :** PWA bingo en temps réel, déployée en continu sur Vercel via GitHub.
- **Stack :** React + Vite + TypeScript + Tailwind CSS v3 + Supabase (Realtime).
- **Deux interfaces :**
  - `/` → **`App.tsx`** = console de l'animatrice (**Diane**, sur **iPad / Safari**)
  - `/live` → **`LiveView.tsx`** = vue spectateurs lecture seule (**Android / Chrome**)

---

## 3. RESSOURCES CLÉS (verbatim)

| Élément | Valeur |
|---|---|
| GitHub | `github.com/mcp2k-007/bingo-tracker` |
| App live (Diane) | `https://bingo-tracker-ten.vercel.app` |
| Vue spectateurs | `https://bingo-tracker-ten.vercel.app/live` |
| Supabase URL | `https://mcrglhtdxxugilojqgff.supabase.co` |
| Supabase ref | `mcrglhtdxxugilojqgff` |
| Client Supabase | `src/lib/supabase.ts` (exporte `supabase`, type `GameStateRow`, supabase-js v2) |
| Variables env | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (Vercel + `.env.local`) |
| Dossier projet | `$HOME\Documents\bingo-tracker` (Windows 10 Pro) |

---

## 4. CONVENTIONS DE DÉPLOIEMENT (à respecter toujours)

1. **Toujours `npm run build` AVANT de pousser** — le build doit être 🟢 (`tsc -b && vite build`, ~78 modules).
2. **Séquence de déploiement complète :**
   ```
   cd $HOME\Documents\bingo-tracker
   npm run build
   git add .
   git commit -m "message"
   git push
   ```
3. **Pièges déjà rencontrés :**
   - `git push` seul dit « Everything up-to-date » si on n'a pas `add` + `commit` d'abord.
   - `npm run build` depuis le mauvais dossier = ENOENT → faut `cd` dans le projet.
   - `npm run build` compile mais ne sert pas → utiliser `npm run dev` (localhost:5173) pour voir.
   - PWA service worker garde l'ancienne version en cache → après déploiement : **`Ctrl+Shift+R`**, ou fermer tous les onglets / désinscrire le SW.
4. **Code & commentaires sans accents** (sécurité UTF-8). **Noms de fichiers en minuscules** (Vercel = Linux, sensible à la casse).
5. **Ne jamais réécrire un fichier sans l'avoir vu.**

---

## 5. RÉALISÉ EN v1.2 (déployé)

**Carte fichier → destination :**

| Fichier | Destination |
|---|---|
| `App.tsx` | `src/` |
| `LiveView.tsx` | `src/pages/` |
| `Footer.tsx` (nouveau) | `src/components/` |
| `AdCarousel.tsx` (nouveau) | `src/components/` |
| `TerminalClock.tsx` (nouveau) | `src/components/` |
| `HistoryTicker.tsx` | `src/components/` |
| `useLiveRadio.ts` (nouveau) | `src/hooks/` |
| `useLiveAudience.ts` (nouveau) | `src/hooks/` |
| `exportGame.ts` | `src/lib/` |
| `index.css` | `src/` |
| `cign-fm-967.png` | `public/` |

**Fonctionnalités livrées :**

- **Branding** « D&bull;IA&bull;NE Bingo Tracker v1.2 » : titre d'onglet, en-têtes des 2 pages, footer, en-tête de l'export TXT.
- **Footer partagé** : « Fabriqué et opéré par Diane Brochu et Paskal Brochu — paskal.brochu@gmail.com © 2026 ».
- **Grille `/live`** : cases tirées passées gris → `bg-blue-700` + texte blanc (cohérent avec l'en-tête B-I-N-G-O).
- **`TerminalClock.tsx`** : horloge format « xx h xx min » (sans secondes).
- **« Boule en cours »** : encart PRINCIPALE (rouge `bg-red-700`, pulse `.ball-waiting`) + réplique = chip historique le plus récent.
- **`AdCarousel.tsx`** : 8 panneaux promo (logo K103.7 + placeholders « Votre Logo ICI » + 2 cartes CIGN-FM). Défilement auto si > 4 panneaux, vitesse `ticker 45s`.
  - ⚠️ **Fix anti-AdBlock** : la classe `.ad-ticker` a été renommée `.mq-track` (uBlock cachait tout ce qui contenait « ad »). Ne pas réintroduire « ad » dans les noms de classes.
- **Bouton AUDIO « EN DIRECT »** : sur les 2 en-têtes, joue le flux CIGN-FM 96.7 via `useLiveRadio.ts`. Visuel ON-AIR (rouge néon + ring) / OFF (gris mat).
- **Compteur d'audience en direct** (`useLiveAudience.ts`, Supabase Realtime Presence, canal `live-audience`) : `/live` se compte comme spectateur ; `App.tsx` affiche « Audiences en direct : N » (raccourci cliquable vers `/live`). Défensif (try/catch, ne plante jamais l'UI de Diane). Aucune table DB requise (présence éphémère).

---

## 6. DOSSIER AUDIO CIGN — RÉSOLU ✅

- **URL du flux utilisée :** `https://arcq.streamb.live/SB00259` (HTTPS natif, **aucun proxy requis**).
- **C'est bien CIGN-FM 96.7.** ARCQ = Association des Radios Communautaires du Québec ; CIGN est une radio communautaire coopérative qui diffuse via l'infra ARCQ.
- **Pourquoi on ne trouve aucune URL en dur dans `playerb.php` :** le lecteur de CIGN utilise **jPlayer** (`jquery.jplayer.min.js`) et charge l'URL du flux **dynamiquement** via un appel WordPress **`admin-ajax.php`**. L'URL n'est donc PAS écrite en texte clair dans le code source — c'est normal.
- **Pourquoi ça « semblait » être le mauvais poste :** un flux live joue ce qui passe en ondes en temps réel. Hors de l'heure du bingo, CIGN diffuse sa programmation régulière (country, Top 20...). **Pendant le tirage de 16 h, le flux portera le Radio-Bingo.**
- **Vérif définitive (optionnelle, 20 s) :** DevTools → Network → filtre **« Media »** → Play sur le lecteur CIGN → la nouvelle requête = le vrai flux → clic droit → Copy link address.

---

## 7. EN ATTENTE / ROADMAP (après le test)

- **📊 Microsoft Clarity** (analytics rapide) : ~5 min, gratuit, enregistrements de sessions + heatmaps + régions. Étapes : créer projet sur clarity.microsoft.com (URL `bingo-tracker-ten.vercel.app`) → récupérer le Project ID → coller le script avant `</head>` dans `index.html` → build/push. **Project ID pas encore fourni.** ⚠️ Cookies → ajouter bannière de consentement Loi 25 bientôt.
- **🔐 Analytics maison pour commanditaires** (Phase 3.6) : table Supabase `viewer_sessions`, tracking dans `/live`, page `/stats` protégée par mot de passe, exports Excel/PDF. **À bâtir proprement APRÈS le test.** Approche hybride validée (Clarity + Vercel Analytics + Supabase maison). ⚠️ Vercel Hobby = non commercial → usage commercial nécessite Pro (20 $/mois) ; events custom = Pro.
- **🧹 Ménage** : `dev-dist/` a été committé par erreur → l'ajouter au `.gitignore` :
  ```
  echo "dev-dist/" >> .gitignore
  git rm -r --cached dev-dist
  git commit -m "chore: ignore dev-dist"
  git push
  ```
- **📻 Droits de rediffusion CIGN** : à confirmer avec M. Luc Frechette / la station avant usage commercial du flux audio.
- **v1.3** : authentification utilisateurs payants (Supabase Auth).
- **v1.4** : reconnaissance vocale — coche automatique des boules + déclencheurs par mots-clés (« Pop-pop-pop BINGO » → presse BINGO ; « On repart le bingo pour la carte pleine » → reset/resume). Se branche sur la logique de comptage des cases blanches.

---

## 8. WATCH-LIST POUR LE TEST EN DIRECT (16 h)

- [ ] **Sync temps réel** des boules iPad (Diane) → Android (spectateurs) — latence ?
- [ ] **Compteur d'audience** : monte-t-il/descend-il correctement ?
- [ ] **Bannière de vérification BINGO** : s'affiche au bon moment ?
- [ ] **Bouton AUDIO EN DIRECT** : joue bien le Radio-Bingo pendant le tirage ?
- [ ] **Sauvegarde de partie** (TXT / JSON) à la fin.
- [ ] **Logique gagnante** : compte les cases **BLANCHES (non cochées)** restantes du motif courant.

**Motifs officiels :** Bingo régulier (4 coins / ligne / diagonale) · Lettre H (col B + col I + rangée du milieu, centre libre inclus) · Carte pleine (jackpot 4000-5000 $) · Consolation (~1000 $).

---

## 9. CONTACTS & IDENTIFIANTS

- **Diane Brochu** — animatrice du bingo, Sherbrooke. Teste sur iPad Safari.
- **Paskal Brochu** — dev / opérateur. `paskal.brochu@gmail.com`.
- **CIGN-FM 96.7** (Coaticook / Estrie) — `cignfm.ca` — flux `arcq.streamb.live/SB00259`.
  - Commanditaire : **M. Luc Frechette**, conseiller aux ventes — **819 804-0967**.
- **K103.7** (Kahnawake) — `k1037.com/radiobingo/` — lié au Radio-Bingo (commanditaire/affiché).

---

*Fin du brief. Bon tirage, et que les cases blanches tombent vite ! 🔴🎲*
