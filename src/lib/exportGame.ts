// ============================================
// D-IA-NE BINGO TRACKER v1.0
// Logique d'exportation d'une partie sauvegardee
// ============================================
// Genere deux fichiers telechargeables :
//   - un fichier .txt lisible par un humain (LIST OUTPUT)
//   - un fichier .json reutilisable (base de donnees)

import { getLetterForNumber, COLUMNS } from './bingoLogic'

// ============================================
// STRUCTURE D'UNE PARTIE SAUVEGARDEE
// ============================================
export interface SavedGame {
  name: string              // Nom du bingo (ex: "Bingo Special")
  startedAt: string | null  // Heure de debut (ISO)
  endedAt: string           // Heure de fin (ISO)
  durationMinutes: number   // Duree en minutes
  drawnNumbers: number[]     // Numeros tires dans l'ordre
  totalDrawn: number         // Nombre total de boules tirees
}

// ============================================
// FONCTION : Formater une DATE seule (sans heure)
// Exemple : "22 mai 2026"
// ============================================
function formatDateOnly(isoString: string | null): string {
  if (!isoString) return 'Non demarre'
  const date = new Date(isoString)
  const jour = date.getDate()
  const mois = [
    'janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre',
  ][date.getMonth()]
  const annee = date.getFullYear()
  return `${jour} ${mois} ${annee}`
}

// ============================================
// FONCTION : Formater une HEURE seule
// Exemple : "02:35"
// ============================================
function formatTimeOnly(isoString: string | null): string {
  if (!isoString) return '--:--'
  const date = new Date(isoString)
  const heures = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${heures}:${minutes}`
}

// ============================================
// FONCTION : Formater la duree au format "XhXXm"
// Exemple : 75 minutes -> "1h15m" ; 8 minutes -> "0h08m"
// ============================================
function formatDuration(totalMinutes: number): string {
  const heures = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${heures}h${String(minutes).padStart(2, '0')}m`
}

// ============================================
// FONCTION : Nettoyer le nom (retire une extension .txt/.json si tapee)
// ============================================
function cleanGameName(name: string): string {
  return name
    .trim()
    .replace(/\.(txt|json)$/i, '') // Retire .txt ou .json a la fin si present
    .trim()
}

// ============================================
// FONCTION : Generer un nom de fichier propre
// Exemple : "Bingo_Special_2026-05-22_02h35"
// ============================================
function buildFileName(name: string, endedAt: string): string {
  const date = new Date(endedAt)
  const annee = date.getFullYear()
  const mois = String(date.getMonth() + 1).padStart(2, '0')
  const jour = String(date.getDate()).padStart(2, '0')
  const heures = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  // On nettoie le nom : remplace les espaces et caracteres speciaux par "_"
  const cleanName = cleanGameName(name)
    .replace(/[^a-zA-Z0-9-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')

  return `${cleanName}_${annee}-${mois}-${jour}_${heures}h${minutes}`
}

// ============================================
// FONCTION : Construire la CARTE BINGO verticale
// Titres B-I-N-G-O en colonnes, boules tirees empilees
// en dessous de leur colonne respective, en ordre croissant.
// ============================================
function buildVerticalBingoCard(drawnNumbers: number[]): string {
  // Largeur de chaque colonne (pour l'alignement)
  const colWidth = 5

  // Pour chaque colonne (B,I,N,G,O), on recupere ses numeros tries
  const columnsData = COLUMNS.map((column) => {
    return drawnNumbers
      .filter((value) => getLetterForNumber(value) === column.letter)
      .sort((a, b) => a - b) // Ordre croissant
  })

  // Nombre maximum de numeros dans une colonne (pour savoir combien de lignes)
  const maxRows = Math.max(0, ...columnsData.map((col) => col.length))

  // ----- Ligne des titres : B    I    N    G    O -----
  const headerLine = COLUMNS
    .map((column) => column.letter.padStart(colWidth, ' '))
    .join('')

  // ----- Ligne de separation sous les titres -----
  const separatorLine = COLUMNS
    .map(() => '--'.padStart(colWidth, ' '))
    .join('')

  // ----- Lignes des numeros (rangee par rangee) -----
  const numberLines: string[] = []
  for (let row = 0; row < maxRows; row++) {
    const line = columnsData
      .map((col) => {
        const value = col[row]
        // Si la colonne a un numero a cette rangee, on l'affiche ; sinon espace vide
        return value !== undefined
          ? String(value).padStart(colWidth, ' ')
          : ''.padStart(colWidth, ' ')
      })
      .join('')
    numberLines.push(line)
  }

  // Assemblage final
  return [headerLine, separatorLine, ...numberLines].join('\n')
}

// ============================================
// FONCTION : Construire le contenu du fichier .txt
// Format "LIST OUTPUT" lisible par un humain
// ============================================
function buildTextContent(game: SavedGame): string {
  const remaining = 75 - game.totalDrawn
  const displayName = cleanGameName(game.name)

  // Liste compacte sur une ligne (ordre de tirage)
  const ballsCompact = game.drawnNumbers
    .map((value) => `${getLetterForNumber(value)}-${value}`)
    .join(', ')

  // Carte BINGO verticale (boules tirees par colonne)
  const bingoCard = buildVerticalBingoCard(game.drawnNumbers)

  return `============================================
   D-IA-NE BINGO TRACKER v1.0
   LIST OUTPUT
============================================

Nom du bingo      : ${displayName}
Date              : ${formatDateOnly(game.startedAt)}
Heure de debut    : ${formatTimeOnly(game.startedAt)}
Heure de fin      : ${formatTimeOnly(game.endedAt)}
Duration          : ${formatDuration(game.durationMinutes)}
Boules sorties    : ${game.totalDrawn}
Boules restantes  : ${remaining}

--------------------------------------------
   NUMEROS TIRES (ordre de tirage)
--------------------------------------------

${ballsCompact}

--------------------------------------------
   CARTE BINGO (boules sorties, ordre croissant)
--------------------------------------------

${bingoCard}

============================================
   Logiciel Fabrique et Opere par:
   Diane Brochu, Sherbrooke (c) 2026
============================================
`
}

// ============================================
// FONCTION UTILITAIRE : Declencher un telechargement
// ============================================
function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ============================================
// FONCTION : Telecharger UNIQUEMENT le fichier .txt
// (Declenche par un clic manuel = compatible iPad Safari)
// ============================================
export function downloadTextFile(game: SavedGame) {
  const baseFileName = buildFileName(game.name, game.endedAt)
  const textContent = buildTextContent(game)
  downloadFile(`${baseFileName}.txt`, textContent, 'text/plain;charset=utf-8')
}

// ============================================
// FONCTION : Telecharger UNIQUEMENT le fichier .json
// (Declenche par un clic manuel = compatible iPad Safari)
// ============================================
export function downloadJsonFile(game: SavedGame) {
  const baseFileName = buildFileName(game.name, game.endedAt)
  // On nettoie le nom dans les donnees JSON aussi
  const cleanGame = { ...game, name: cleanGameName(game.name) }
  const jsonContent = JSON.stringify(cleanGame, null, 2)
  downloadFile(`${baseFileName}.json`, jsonContent, 'application/json;charset=utf-8')
}

// ============================================
// FONCTION : Obtenir un apercu du contenu texte
// (Pour affichage dans la modale avant telechargement)
// ============================================
export function getTextPreview(game: SavedGame): string {
  return buildTextContent(game)
}