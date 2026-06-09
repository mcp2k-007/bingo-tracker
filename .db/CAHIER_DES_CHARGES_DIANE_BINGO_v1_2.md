# 📐 CAHIER DES CHARGES — D•IA•NE BINGO Tracker

### Document d'architecture et feuille de route — v1.2 → v1.4

> **Statut du document :** vivant (mis à jour à chaque jalon)
> **Rédigé par :** Claude (Architecte logiciel principal) pour Paskal Brochu
> **Dernière révision :** juin 2026
> **Logiciel fabriqué et opéré par :** Diane Brochu et Paskal Brochu — Sherbrooke © 2026

---

## 1. PRÉSENTATION DU PROJET

**D•IA•NE BINGO Tracker** est une application web progressive (PWA) de suivi de bingo en temps réel. Elle permet à une opératrice (Diane) de cocher les boules tirées sur une carte maîtresse, et à un public mondial de suivre le tirage en direct via une page spectateur, le tout enrichi d'espaces publicitaires monétisables et, à terme, d'automatisation vocale et de comptes utilisateurs payants.

### Acteurs et rôles

| Rôle | Personne | Description |
|------|----------|-------------|
| **Opératrice (utilisatrice finale)** | Diane Brochu | Animatrice de bingo à Sherbrooke. Utilise l'interface principale (`/`) sur iPad (Safari). |
| **Développeur / Propriétaire** | Paskal Brochu | Créateur du projet, point de contact commercial pour la publicité (paskal.brochu@gmail.com). |
| **Architecte logiciel** | Claude | Fournit le code complet (sans placeholders), les commandes exactes, une étape à la fois, avec validation du `npm run build` avant tout déploiement. |
| **Spectateurs** | Public mondial | Consultent la page `/live` (lecture seule) sur Android/Chrome, iPad, desktop, etc. |

### Règle de collaboration

Code **complet et copier-coller direct**, **une étape à la fois**, attente de validation avant de poursuivre, et test obligatoire de `npm run build` en local **avant** chaque `git push` vers Vercel.

---

## 2. LOGIQUE MÉTIER FONDAMENTALE ⭐

> **Principe central à conserver dans tout le code de détection de carte gagnante.**

Le système d'identification d'une carte gagnante doit **impérativement raisonner par décompte des cases BLANCHES (non cochées) restantes**, et non par décompte des cases cochées.

**Pourquoi cette approche :**

- Une carte est gagnante (selon le motif visé) **lorsque le nombre de cases blanches restantes atteint 0** pour ce motif.
- La « proximité de victoire » d'une carte se mesure directement : *« il reste N cases blanches »* — N petit = proche du bingo.
- Cette formulation est plus robuste pour le tri (« qui est le plus proche de gagner ») et pour les futures automatisations (détection de motifs, alerte vocale).

**Pseudo-formule de référence :**

```
casesBlanchesRestantes(carte, motif) =
    nombreTotalDeCasesDuMotif − casesDuMotifDejaCochees(carte)

estGagnante(carte, motif) = (casesBlanchesRestantes(carte, motif) === 0)
```

Cette logique gouverne : la détection de motifs gagnants (backlog), le cochage automatique par reconnaissance vocale (v1.4) et toute future fonction de « cartes proches du bingo ».

---

## 3. STACK TECHNIQUE

| Couche | Technologie |
|--------|-------------|
| **Front-end** | React + Vite + TypeScript + Tailwind CSS v3 |
| **PWA** | `vite-plugin-pwa` |
| **Routage** | `react-router-dom` (`/` = opératrice, `/live` = spectateur) |
| **Back-end / Temps réel** | Supabase (PostgreSQL + Realtime WebSockets, région **Canada Central** 🇨🇦) |
| **Hébergement** | Vercel (déploiement automatique via GitHub) |
| **Polices** | Outfit + Space Grotesk |
| **Icônes** | FontAwesome 6.4.0 |
| **Environnement de dev** | Laptop Windows 10 Pro |
| **Tests** | iPad (Safari, Diane) + Android (Chrome, spectateur) |

> ⚠️ **Convention de code :** accents retirés des **commentaires du code** pour éviter les problèmes UTF-8. Les noms de fichiers/images **toujours en minuscules** (Vercel = Linux, casse sensible).

### Ressources en ligne

| Ressource | Valeur |
|-----------|--------|
| Dépôt GitHub | `github.com/mcp2k-007/bingo-tracker` |
| App live (Diane) | `https://bingo-tracker-ten.vercel.app` |
| Page spectateur | `https://bingo-tracker-ten.vercel.app/live` |
| Supabase URL | `https://mcrglhtdxxugilojqgff.supabase.co` |
| Project REF Supabase | `mcrglhtdxxugilojqgff` |
| Variables d'env Vercel | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (Production + Preview) |

> 🔒 **Action de sécurité en attente :** un token GitHub (`ghp_...`) a été exposé dans des captures. **À supprimer/régénérer** sur `github.com/settings/tokens` (ne casse rien : Vercel utilise sa propre connexion OAuth).

---

## 4. ÉTAT D'AVANCEMENT — CE QUI EST FAIT ET EN LIGNE ✅

### 4.1 — Front-end (interface)

- **Grille B-I-N-G-O** : 75 numéros, auto-scaling responsive (`BingoBoard.tsx`, `BingoCell.tsx`).
- **Encart « Boule en cours »** (`CurrentBall.tsx`) à largeur fixe.
- **Compteurs** Sortis / Restants intégrés dans le header.
- **Bouton BINGO** : verrou rouge qui fige la grille pour la vérification.
- **Historique glissable au doigt** (`HistoryTicker.tsx`).
- **Page spectateur `/live`** (`LiveView.tsx`) en lecture seule, boule compacte style iPad.
- **AdBanner** (`AdBanner.tsx`) : logo commanditaire K103.7 cliquable → `k1037.com/radiobingo`.
- **Modale d'export** (`SaveGameModal.tsx`).
- **Interface v1.1** : boutons compacts, compteurs dans le header.

### 4.2 — Back-end (Supabase)

- **Table `game_state`** (✅ créée) : une **ligne unique** `id = 'current_game'` toujours mise à jour.

```
id               TEXT (PK, = 'current_game')
drawn_numbers    INTEGER[]
started_at       TIMESTAMPTZ
updated_at       TIMESTAMPTZ
bingo_active     BOOLEAN          (Lot 2)
bingo_started_at TIMESTAMPTZ      (Lot 2)
```

- RLS : lecture + écriture publiques. Realtime Publication activée.
- **Diffusion WAN mondiale fonctionnelle** (404 sur `/live` corrigé via `vercel.json`).

### 4.3 — Logique applicative

- **`bingoLogic.ts`** : `COLUMNS` avec `.letter`, `getLetterForNumber`, `getNumbersForColumn`.
- **`useGameState.ts`** : état de la partie + synchro Supabase + timer BINGO + enregistrement des vérifications.
- **`useRealtimeGame.ts`** : écoute temps réel pour les spectateurs `/live`.
- **`exportGame.ts`** : export TXT (« LIST OUTPUT » + carte BINGO verticale) et JSON, incluant les vérifications BINGO (compatible iPad Safari). Fonctions : `downloadTextFile`, `downloadJsonFile`, `getTextPreview`.
- **Sauvegarde auto** en `localStorage`.

### 4.4 — Fonctionnalités LOT 2 (dernier jalon livré)

1. **Timer BINGO vert** ⏱️ — démarre au clic BINGO de Diane, format « 1m17sec », affiché sur l'interface de Diane et sur `/live`, disparaît au déverrouillage.
2. **Synchro de l'état BINGO via Supabase** — colonnes `bingo_active` + `bingo_started_at` ; bannière spectateurs « Ne bougez pas vos cartes, on vérifie un Bingo au téléphone... ».
3. **Enregistrement des vérifications BINGO** (Start / End / Duration) — listées dans l'export TXT sous « VERIFICATIONS BINGO » (Bingo 1, Bingo 2, Bingo 3...).

---

## 5. ÉTAT EXACT OÙ NOUS EN SOMMES 📍

**Phase en cours : 3.6 — Analytics & Monétisation** (approche **hybride** validée : Vercel Analytics + table Supabase custom ; collecte **anonyme-agrégée** conforme **Loi 25** Québec).

```
⚠️ 3.6.A — Table Supabase "viewer_sessions"   ← POINT DE REPRISE (SQL fourni, exécution À CONFIRMER)
⬜ 3.6.B — Tracking dans /live (arrivee, duree, heartbeat, appareil, clics pub)
⬜ 3.6.C — Page /stats protegee par mot de passe (graphiques d'audience)
⬜ 3.6.D — Export Excel + PDF des stats (pour les sponsors)
⬜ 3.6.E — Vercel Analytics (bonus, ~1 ligne)
```

**Données visées pour les sponsors :** spectateurs uniques, courbe d'audience (simultanés minute par minute), pic d'audience, durée moyenne de visionnage (= temps d'exposition de la pub), type d'appareil, région/ville approximative, clics sur l'AdBanner (CTR).

> **Pourquoi construire NOTRE base plutôt que se fier uniquement à l'hébergeur :** Vercel Analytics est gratuit et facile (~1 ligne) mais les données restent chez Vercel, peu exportables, et ne mesurent pas les métriques de vente (durée par spectateur, CTR de la pub). La table Supabase custom nous rend **propriétaires des données**, exportables en Excel/PDF pour les commanditaires. → On garde les deux (hybride).

---

## 6. NOUVELLES EXIGENCES — FEUILLE DE ROUTE v1.2 → v1.4 🚀

> Phasage proposé par l'architecte selon le **risque** et la **valeur immédiate**. Les éléments à faible risque et forte valeur visuelle sont regroupés en v1.2 (réalisables rapidement) ; les modules lourds (audio live, comptes payants, IA vocale) sont étalés sur v1.3 et v1.4.

### 🟢 v1.2 — Identité visuelle + Layout publicitaire *(réalisable à court terme)*

#### 6.1 — Interface & Identité visuelle

- **Nom de l'application** : « **D•IA•NE BINGO Tracker v1.2** ».
  - **Fichiers touchés :** `index.html` (`<title>`), en-tête de `App.tsx` et `LiveView.tsx`.
- **Pied de page (footer)** affichant exactement :

  > **Fabriqué et opéré par Diane Brochu et Paskal Brochu paskal.brochu@gmail.com © 2026**

  - **Architecture :** créer un composant réutilisable `Footer.tsx` (`src/components/`), importé à la fois dans `App.tsx` et `LiveView.tsx` pour rester cohérent partout. L'adresse courriel sera un lien `mailto:`.

#### 6.2 — Monétisation & affichages publicitaires (layout)

- **Retrait du bouton/encart « Boule en cours »** de l'en-tête pour **maximiser l'espace de la bannière publicitaire**.
  - **Architecture :** retirer `CurrentBall.tsx` du header (ou le déplacer ailleurs dans la grille). Récupérer l'espace libéré pour élargir la zone `AdBanner`. ⚠️ Vérifier que l'information « dernière boule » reste visible autrement (ex. mise en évidence de la dernière case cochée), pour ne pas pénaliser Diane.
- **Bannière publicitaire défilante** — vitesse moyenne, défilement **droite → gauche**.
  - **Comportement :** tant que l'espace statique n'est pas plein, les pubs restent fixes ; le défilement **s'active automatiquement** quand le nombre de pubs dépasse la capacité statique (seuil ≈ 4 à 5 pubs).
  - **Architecture :** faire évoluer `AdBanner.tsx` vers un composant `AdCarousel.tsx` (ou option dans `AdBanner`). Liste de pubs en données (`ads: {id, image, lien, alt}[]`). Défilement CSS (`@keyframes` translateX + `animation`) conditionné par `ads.length >= seuil`. Boucle continue (duplication de la liste pour un défilement sans coupure).
- **Gabarits par défaut (2 à 3)** affichant :

  > **« Votre Logo ICI – Contactez Paskal à paskal.brochu@gmail.com »**

  - **But :** démontrer la disponibilité des espaces aux futurs annonceurs.
  - **Architecture :** entrées placeholder dans le tableau `ads`, rendues comme cartes cliquables (`mailto:paskal.brochu@gmail.com`).

> 💡 Cette phase est essentiellement front-end, sans dépendance externe → c'est la candidate idéale pour un déploiement rapide et sûr.

---

### 🟡 v1.3 — Multimédia + Infrastructure de comptes

#### 6.3 — Intégration multimédia : lecteur audio live

- **Lecteur audio** avec bouton **Lecture / Pause** diffusant le **signal audio en direct du Radio Bingo** sur l'interface web.
  - **Source indiquée :** CIGN-FM 97.6.
  - **Architecture :** composant `LiveAudioPlayer.tsx` utilisant un élément `<audio>` HTML5 pointant vers l'**URL du flux de diffusion** (stream Icecast/Shoutcast/HLS de la station). État `isPlaying` géré en React (`useState`), bouton bascule Lecture/Pause (icônes FontAwesome `play`/`pause`).
  - ⚠️ **Dépendances à clarifier (bloquantes) :**
    1. **Confirmer la station et la fréquence exactes** ainsi que **l'URL publique du flux audio** (le résumé v1.1 mentionnait K103.7 comme commanditaire de la bannière ; ici tu indiques CIGN-FM 97.6 pour l'audio — à valider qu'il s'agit bien de la source du Radio Bingo).
    2. **Droits de diffusion / autorisation** de rediffuser le signal sur notre site (point juridique à confirmer avec la station).
    3. **Politique d'autoplay** des navigateurs (iOS Safari surtout) : la lecture devra être déclenchée par un clic utilisateur (c'est déjà le cas avec un bouton Play).

#### 6.4 — Sécurité & gestion des comptes (fondations)

- **Système d'authentification (Sign-in / Login)** réservé aux **utilisateurs payants**.
  - **Architecture recommandée :** s'appuyer sur **Supabase Auth** (déjà dans notre stack) — email + mot de passe pour commencer, avec un champ/role `is_paid` ou une table `subscriptions` liée à `auth.users`.
  - **Contrôle d'accès :** RLS Supabase basé sur le rôle ; côté front, route protégée (ex. `/vip`) qui vérifie la session + le statut payant avant d'afficher le contenu exclusif.
  - **Note :** la **gestion du paiement** (Stripe ou autre) est un chantier distinct, prévu en v2.0 (cf. backlog). En v1.3 on pose les **fondations d'auth**, le statut « payant » pouvant d'abord être activé manuellement.

---

### 🔴 v1.4 — Intelligence artificielle & automatisation vocale *(module le plus complexe)*

#### 6.5 — Reconnaissance vocale & cochage automatique

- **Système de reconnaissance vocale** écoutant le tirage et **cochant automatiquement** les boules sur la carte maîtresse.
  - **Architecture envisagée :**
    - **Capture audio :** soit le micro de l'appareil (Web Speech API — `SpeechRecognition`), soit directement le flux audio du Radio Bingo (v1.3) → analyse de la transcription.
    - **Transcription :** Web Speech API (gratuit, intégré navigateur, mais variable en français-Québec et inégal selon le navigateur) **ou** un service de transcription serveur plus robuste (ex. Whisper côté back-end) si la précision l'exige.
    - **Interprétation :** parser la transcription pour détecter les numéros annoncés (« B-7 », « sous le O, 65 »...) et appeler la fonction existante de cochage de `useGameState.ts`.
    - **Lien avec la logique métier :** chaque cochage met à jour le décompte des **cases blanches restantes** (section 2), socle des futures alertes de proximité.
  - ⚠️ **Risques :** fiabilité de la reconnaissance en conditions réelles (bruit, accent, débit), faux positifs. → **Garde-fou obligatoire :** mode semi-automatique où Diane **valide/corrige** d'un coup d'œil ; ne jamais retirer le contrôle manuel.

#### 6.6 — Mots-clés déclencheurs (automatisation du flux de jeu)

- **« Pop-pop-pop BINGO »** → le système **presse automatiquement le bouton BINGO** (déclenche le verrou + timer + bannière de vérification).
- **« On repart le bingo pour la carte pleine »** (après validation) → le système **réinitialise l'alerte et reprend le jeu automatiquement** (déverrouille, ferme la bannière de vérification, poursuit le tirage).
  - **Architecture :** moteur de détection de phrases-clés (correspondance floue sur la transcription pour tolérer les variations) déclenchant les actions déjà existantes (`activerBingo()`, `reset/reprise`). Confirmation visuelle systématique de l'action déclenchée par la voix.
  - ⚠️ **Garde-fou :** vu l'enjeu (un faux déclenchement fige la partie pour tout le monde), prévoir une **confirmation rapide** ou un délai d'annulation, et conserver les boutons manuels en parallèle.

---

## 7. SYNTHÈSE DE LA FEUILLE DE ROUTE

| Version | Bloc | Complexité | Dépendances externes |
|---------|------|-----------|----------------------|
| **3.6** (en cours) | Analytics & monétisation (tracking, /stats, exports) | Moyenne | Supabase |
| **v1.2** | Nom + footer + retrait « Boule en cours » + bannière pub défilante + gabarits | **Faible** | Aucune (front-end pur) |
| **v1.3** | Lecteur audio live CIGN-FM + fondations auth comptes | Moyenne-haute | URL du flux + droits diffusion + Supabase Auth |
| **v1.4** | Reconnaissance vocale + cochage auto + mots-clés déclencheurs | **Haute** | Service de transcription, tests terrain |
| **v2.0** (backlog) | Comptes VIP payants (paiement/abonnement), motifs gagnants, annonce vocale, mode TV, thèmes, carrousel pub admin | — | Stripe, etc. |

---

## 8. WORKFLOW DE DÉPLOIEMENT (rappel)

```powershell
# 1. Tester le build en local D'ABORD
npm run build       # 🟢 "built in Xs" = OK   🔴 erreur = corriger AVANT de pousser

# 2. Pousser (Vercel redeploie automatiquement en ~1 min)
git add .
git commit -m "description du changement"
git push
```

- Serveur local : `cd $HOME\Documents\bingo-tracker` puis `npm run dev` → `localhost:5173`.

---

## 9. LEÇONS & PIÈGES À ÉVITER

1. **JSX multi-lignes** : VS Code casse parfois les balises au collage → mettre les balises ouvrantes sur une seule ligne, vérifier le haut du fichier.
2. **Build prod plus strict que dev** : toujours `npm run build` avant `git push` (imports inutilisés, types manquants).
3. **`vercel.json`** (rewrites → `/index.html`) corrige le 404 sur `/live` → **ne jamais le supprimer**.
4. **Ne pas réécrire un fichier sans voir l'original** (risque d'effacer des fonctions utilisées ailleurs, ex. `exportGame.ts`).
5. **Variables d'env Supabase** : dans `.env.local` (local) **ET** dans les Environment Variables de Vercel (en ligne).
6. **Casse sensible Vercel/Linux** : noms de fichiers/images toujours en minuscules.

---

*Cahier des charges — D•IA•NE BINGO Tracker v1.2.*
*Logiciel fabriqué et opéré par Diane Brochu et Paskal Brochu — paskal.brochu@gmail.com © 2026* 🚀
