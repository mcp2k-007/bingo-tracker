// ============================================
// D-IA-NE BINGO TRACKER v1.0
// Logique metier du bingo
// ============================================
// Fonctions reutilisables pour la logique du jeu.

import type { BingoLetter } from '../types'

// ============================================
// CONFIGURATION DES COLONNES
// Chaque lettre couvre une plage de 15 numeros
// ============================================
export const COLUMNS: { letter: BingoLetter; start: number; end: number }[] = [
  { letter: 'B', start: 1, end: 15 },
  { letter: 'I', start: 16, end: 30 },
  { letter: 'N', start: 31, end: 45 },
  { letter: 'G', start: 46, end: 60 },
  { letter: 'O', start: 61, end: 75 },
]

// Nombre total de numeros dans un bingo classique
export const TOTAL_NUMBERS = 75

// ============================================
// FONCTION : Trouver la lettre d'un numero
// Exemple : getLetterForNumber(52) retourne 'G'
// ============================================
export function getLetterForNumber(value: number): BingoLetter {
  for (const column of COLUMNS) {
    if (value >= column.start && value <= column.end) {
      return column.letter
    }
  }
  // Securite : ne devrait jamais arriver pour un numero valide (1-75)
  return 'B'
}

// ============================================
// FONCTION : Obtenir les 15 numeros d'une colonne
// Exemple : getNumbersForColumn('B') retourne [1, 2, 3, ..., 15]
// ============================================
export function getNumbersForColumn(letter: BingoLetter): number[] {
  const column = COLUMNS.find((c) => c.letter === letter)
  if (!column) return []

  const numbers: number[] = []
  for (let i = column.start; i <= column.end; i++) {
    numbers.push(i)
  }
  return numbers
}

// ============================================
// FONCTION : Formater l'affichage d'un numero
// Exemple : formatBall(52) retourne "G - 52"
// ============================================
export function formatBall(value: number): string {
  const letter = getLetterForNumber(value)
  return `${letter} - ${value}`
}