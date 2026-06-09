// ============================================
// D•IA•NE Bingo Tracker v1.2
// Logique d'exportation d'une partie sauvegardee
// ============================================
// Genere deux fichiers telechargeables :
//   - un fichier .txt lisible par un humain (LIST OUTPUT)
//   - un fichier .json reutilisable (base de donnees)

import { getLetterForNumber, COLUMNS } from './bingoLogic'
import type { BingoCheck } from '../types'

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
  bingoChecks?: BingoCheck[] // Verifications BINGO (Start/End/Duration)
}

// ============================================
// FONCTION : Formater une DATE seule (sans heure)
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
// ============================================
function formatDuration(totalMinutes: number): string {
  const heures = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${heures}h${String(minutes).padStart(2, '0')}m`
}

// ============================================
// FONCTION : Formater une duree en SECONDES -> "XmYYs"
// ============================================
function formatDurationSec(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m${String(s).padStart(2, '0')}s`
}

// ============================================
// FONCTION : Nettoyer le nom
// ============================================
function cleanGameName(name: string): string {
  return name
    .trim()
    .replace(/\.(txt|json)$/i, '')
    .trim()
}

// ============================================
// FONCTION : Generer un nom de fichier propre
// ============================================
function buildFileName(name: string, endedAt: string): string {
  const date = new Date(endedAt)
  const annee = date.getFullYear()
  const mois = String(date.getMonth() + 1).padStart(2, '0')
  const jour = String(date.getDate()).padStart(2, '0')
  const heures = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  const cleanName = cleanGameName(name)
    .replace(/[^a-zA-Z0-9-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')

  return `${cleanName}_${annee}-${mois}-${jour}_${heures}h${minutes}`
}

// ============================================
// FONCTION : Construire la CARTE BINGO verticale
// ============================================
function buildVerticalBingoCard(drawnNumbers: number[]): string {
  const colWidth = 5

  const columnsData = COLUMNS.map((column) => {
    return drawnNumbers
      .filter((value) => getLetterForNumber(value) === column.letter)
      .sort((a, b) => a - b)
  })

  const maxRows = Math.max(0, ...columnsData.map((col) => col.length))

  const headerLine = COLUMNS
    .map((column) => column.letter.padStart(colWidth, ' '))
    .join('')

  const separatorLine = COLUMNS
    .map(() => '--'.padStart(colWidth, ' '))
    .join('')

  const numberLines: string[] = []
  for (let row = 0; row < maxRows; row++) {
    const line = columnsData
      .map((col) => {
        const value = col[row]
        return value !== undefined
          ? String(value).padStart(colWidth, ' ')
          : ''.padStart(colWidth, ' ')
      })
      .join('')
    numberLines.push(line)
  }

  return [headerLine, separatorLine, ...numberLines].join('\n')
}

// ============================================
// FONCTION : Construire la section VERIFICATIONS BINGO
// ============================================
function buildBingoChecksSection(bingoChecks?: BingoCheck[]): string {
  if (!bingoChecks || bingoChecks.length === 0) {
    return 'Aucune verification BINGO enregistree.'
  }

  const lines = bingoChecks.map((check, index) => {
    const startStr = formatTimeOnly(check.startTime)
    const endStr = formatTimeOnly(check.endTime)
    const durStr = formatDurationSec(check.durationSeconds)
    return `Bingo ${index + 1} : Start ${startStr} - End ${endStr}  |  Duration: ${durStr}`
  })

  return lines.join('\n')
}

// ============================================
// FONCTION : Construire le contenu du fichier .txt
// ============================================
function buildTextContent(game: SavedGame): string {
  const remaining = 75 - game.totalDrawn
  const displayName = cleanGameName(game.name)

  const ballsCompact = game.drawnNumbers
    .map((value) => `${getLetterForNumber(value)}-${value}`)
    .join(', ')

  const bingoCard = buildVerticalBingoCard(game.drawnNumbers)
  const bingoChecksSection = buildBingoChecksSection(game.bingoChecks)

  // Nom de l'app : \u2022 = point "•" (source ASCII, rendu UTF-8 dans le .txt)
  return `============================================
   D\u2022IA\u2022NE Bingo Tracker v1.2
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
   VERIFICATIONS BINGO
--------------------------------------------

${bingoChecksSection}

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
   Diane Brochu et Paskal Brochu (c) 2026
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
// ============================================
export function downloadTextFile(game: SavedGame) {
  const baseFileName = buildFileName(game.name, game.endedAt)
  const textContent = buildTextContent(game)
  downloadFile(`${baseFileName}.txt`, textContent, 'text/plain;charset=utf-8')
}

// ============================================
// FONCTION : Telecharger UNIQUEMENT le fichier .json
// ============================================
export function downloadJsonFile(game: SavedGame) {
  const baseFileName = buildFileName(game.name, game.endedAt)
  const cleanGame = { ...game, name: cleanGameName(game.name) }
  const jsonContent = JSON.stringify(cleanGame, null, 2)
  downloadFile(`${baseFileName}.json`, jsonContent, 'application/json;charset=utf-8')
}

// ============================================
// FONCTION : Obtenir un apercu du contenu texte
// ============================================
export function getTextPreview(game: SavedGame): string {
  return buildTextContent(game)
}
