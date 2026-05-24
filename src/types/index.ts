// ============================================
// D-IA/NE BINGO TRACKER v1.1
// Types partages dans toute l'application
// ============================================

export type BingoLetter = 'B' | 'I' | 'N' | 'G' | 'O'

export interface GameState {
  drawnNumbers: number[]
  startedAt: string | null
}

export interface BingoCheck {
  startTime: string
  endTime: string
  durationSeconds: number
}