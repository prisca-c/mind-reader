import type { Player } from '#types/player'
import type { UserId } from '#models/user'
import type { Opaque } from '@poppinss/utils/types'

export type GameSessionId = Opaque<string, 'GameSessionId'>

export interface WordList {
  hintGiver: string[]
  guesser: string[]
}

export interface GameSession {
  sessionId: GameSessionId
  player1: Player & { accepted: boolean }
  player2: Player & { accepted: boolean }
  hintGiver: UserId | null
  turn: UserId | null
  word: string | null
  wordsList: WordList
  guessed: boolean
  startedAt: string | null
}
