// ============================================
// D-IA-NE BINGO TRACKER v1.0
// Definitions des types TypeScript
// ============================================
// Ce fichier decrit la "forme" de nos donnees.
// TypeScript utilise ces modeles pour eviter les bugs.

// La lettre d'une colonne de bingo
export type BingoLetter = 'B' | 'I' | 'N' | 'G' | 'O'

// Un numero de bingo avec toutes ses infos
export interface BingoNumber {
  value: number        // Le numero (1 a 75)
  letter: BingoLetter  // La colonne (B, I, N, G ou O)
  isDrawn: boolean     // Est-ce que ce numero est sorti ?
  drawOrder: number    // Ordre de tirage (0 = pas tire, 1 = premier tire, etc.)
}

// La "boule en cours" (dernier numero tire)
export interface CurrentBall {
  letter: BingoLetter  // La lettre (ex: G)
  value: number        // Le numero (ex: 52)
}

// L'etat complet d'une partie de bingo
export interface GameState {
  drawnNumbers: number[]   // Liste ordonnee des numeros tires (le plus recent en dernier)
  startedAt: string | null // Date/heure de debut de partie (format ISO)
}