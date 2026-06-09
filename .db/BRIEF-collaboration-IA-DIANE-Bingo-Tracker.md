# BRIEF DE COLLABORATION — D•IA•NE Bingo Tracker v1.2
### Document de passation pour IA collaboratrice (handoff branding & identité visuelle)

> **Mode d'emploi pour l'IA qui reçoit ce document :** Tu reprends un mandat de branding déjà entamé. Lis l'intégralité avant de produire quoi que ce soit. Les sections « DÉCISIONS VERROUILLÉES » ne sont PAS à rouvrir sauf demande explicite du client. Ton rôle, ta cible et tes contraintes sont définis ci-dessous. Travaille en français (Québec).

---

## 1. TON RÔLE (à adopter)

Agis comme **Directeur Général et Stratège Créatif Senior** d'une agence de marketing montréalaise : 25+ ans d'expérience en marketing de marque, finance, développement produit, et maîtrise des lois canadiennes/québécoises de commercialisation. Esprit à la fois stratégique et créatif. Méthode attendue : ne pas livrer une simple liste finale — proposer des directions stratégiques, poser des questions de cadrage, puis affiner.

---

## 2. LE PROJET

Application numérique de **suivi et d'analyse pour le bingo**. Nom de code : **D•IA/NE Bingo Tracker** (jeu de mots sur « IA »). Déploiement de la **v1.2 cette semaine**. Objectif du mandat actuel : solidifier et professionnaliser l'identité visuelle et le naming avant la mise à l'échelle.

**Origine (actif de marque à protéger) :** l'app est née d'un besoin familial réel — aider la mère du créateur à noter rapidement les numéros sur son iPad pour les redistribuer à ses sœurs et amies via Messenger/téléphone en temps réel. Cette authenticité est un pilier narratif, pas une anecdote.

---

## 3. LA CIBLE

Public **intergénérationnel, 30–70 ans**. Deux profils :
- le **joueur en salle** qui veut un outil d'assistance fiable ;
- le **joueur de radio-bingo à la maison** qui veut simplifier le suivi de ses cartes.

Exigence : interface assez **intuitive pour les seniors**, technologie assez **réactive** pour séduire une clientèle plus jeune. Ne pas dénaturer le côté communautaire du bingo — le moderniser.

---

## 4. RÔLE DE L'IA DANS L'APPLICATION (technique)

L'IA est le **moteur d'automatisation en arrière-plan**, pas un gadget :
- **Reconnaissance vocale (listening)** : écoute et analyse les tirages en direct.
- **Marquage autonome** : associe les boules annoncées aux boutons de la carte virtuelle.
- **Calcul temps réel** : état du jeu avec précision chirurgicale, dont le **décompte des cases blanches restantes** pour valider rapidement une carte gagnante.
- **Gestion du flux** : pause automatique lors d'une vérification de carte, gestion des **états d'alerte (bouton rouge)** de façon automatisée.

> **Différenciateur clé à exploiter en branding :** l'IA *écoute* la salle. La plupart des trackers sont des cartons à cocher au doigt — ici, c'est une assistante qui entend.

---

## 5. L'AMBITION

Passage d'une solution familiale à une **commercialisation B2B/B2C à l'échelle du Québec**. Démarcher les bingos communautaires et commerciaux manquant d'infrastructure techno pour le tirage en direct. Offre clé en main : collecte de données, distribution en direct, hébergement serveur des cartes virtuelles.

---

## 6. DÉCISIONS VERROUILLÉES (ne pas rouvrir sans demande)

**6.1 — Le nom signé : `D•IA•NE`**
Contraintes typographiques fermes :
- **D** majuscule, en tête.
- **IA** collé, en majuscules (le hook, à protéger).
- Symbole séparateur retenu : le **point gras `•`**.

**6.2 — Pourquoi le `•` (rationnel stratégique) :** double sens sémantique. Visuellement = la marque d'un **dauber de bingo** sur un carton (registre ludique/physique). Conceptuellement = un **nœud de données / voyant d'une IA active** (registre tech). Un seul signe relie « jeu » et « techno » — le pont exact que le produit incarne.

**6.3 — Direction créative retenue : FUSION A+B**
- **A « L'Assistante »** : chaleur humaine, accessibilité seniors, capitalise sur l'origine familiale. Diane perçue presque comme une présence fiable.
- **B « Le Moteur »** : crédibilité B2B, précision, fiabilité de validation.
- **Idée-signature de la fusion :** le **point qui change de couleur selon l'état de la partie** — fonctionnel + unique + démontrable en démo.

**6.4 — Concept de logo actuel (logotype) :**
- `D` et `NE` en couleur de texte neutre (ancrage rassurant).
- `IA` en **bleu** (#378ADD) = cœur intelligent qui ressort.
- Les deux `•` en **coral** (#D85A30) = jetons de dauber (chaleur, tactile).
- À gauche du premier point : **ondes d'écoute** (2 arcs) = « Diane écoute » (la reconnaissance vocale). Narration gauche→droite : écoute (ondes) → marque (point plein).
- **Système d'états du point** (signature B) :
  - 🟢 vert (#1D9E75) = partie en direct ;
  - 🟠 ambre (#EF9F27) = vérification ;
  - 🔴 rouge (#E24B4A) = carte à valider (bouton rouge automatisé).
- Sous le wordmark : « BINGO TRACKER » en lettrage espacé, secondaire.

**6.5 — Code SVG du mockup actuel (référence visuelle) :**
```svg
<svg width="100%" viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg">
  <!-- ondes d'écoute (gauche du point 1) -->
  <path d="M 251 93 A 15 15 0 0 0 251 115" fill="none" stroke="#D85A30" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M 245 87 A 24 24 0 0 0 245 121" fill="none" stroke="#D85A30" stroke-width="2" stroke-linecap="round" opacity="0.55"/>
  <!-- wordmark -->
  <text x="192" y="125" font-weight="500" font-size="60" fill="#1a1a1a">D</text>
  <circle cx="262" cy="104" r="8" fill="#D85A30"/>
  <text x="288" y="125" font-weight="500" font-size="60" fill="#378ADD">IA</text>
  <circle cx="378" cy="104" r="8" fill="#D85A30"/>
  <text x="404" y="125" font-weight="500" font-size="60" fill="#1a1a1a">NE</text>
  <text x="340" y="162" text-anchor="middle" font-size="16" letter-spacing="5" fill="#666">BINGO TRACKER</text>
  <!-- système d'états -->
  <circle cx="200" cy="232" r="8" fill="#1D9E75"/>
  <circle cx="340" cy="232" r="8" fill="#EF9F27"/>
  <circle cx="480" cy="232" r="8" fill="#E24B4A"/>
</svg>
```

**6.6 — Piste typo (recommandation, non figée) :** sans-serif **humaniste arrondi** (terminaisons douces) pour sceller chaleur + accessibilité seniors tout en restant moderne.

---

## 7. CONSIDÉRATIONS LÉGALES / QUÉBEC (à garder en tête)

- « **Bingo** » et « **Tracker** » sont des termes **génériques non protégeables** comme tels. L'actif déposable = **D•IA•NE** + son traitement visuel.
- **Loi 96 / Charte de la langue française** : affichage et matériel commercial prioritairement en français. Envisager un équivalent FR pour « Tracker » (ex. « Suivi », « Assistant »).
- Vérifier disponibilité marque + noms de domaine `.com` / `.ca` avant mise à l'échelle.

---

## 8. PROCHAINES ÉTAPES (en cours)

1. **Icône seule** : symbole compact (point + ondes dans un carré arrondi, sans le mot) pour icône d'app iOS/Android et favicon. ← *prochaine pièce à produire.*
2. **Typographie** : proposer des fontes humanistes arrondies nommées.
3. **Harmonisation palette** : valider que le coral s'accorde avec la couleur dominante existante de l'app v1.2 (interface iPad actuelle).

---

## 9. QUESTIONS OUVERTES (à poser/confirmer avec le client)

- Quelle est la **couleur dominante actuelle** de l'app v1.2 ? (pour harmoniser le coral)
- « Tracker » conservé tel quel, ou **équivalent français** souhaité pour la version commerciale ?
- L'icône d'app : on garde **point + ondes**, ou on teste d'autres compositions (carton 5×5, boule de bingo stylisée) ?
- Ambition de dépôt de marque : **immédiat** (avant mise à l'échelle) ou plus tard ?

---

*Fin du brief. L'IA collaboratrice peut désormais reprendre le mandat au point 8.*
