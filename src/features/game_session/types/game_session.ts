import type { Opaque } from '@poppinss/utils/types'
import type { SessionState } from '#features/game_session/enums/session_state'
import type { Player } from '#features/game_session/types/player'
import type { UserId } from '#models/user'

export type GameSessionId = Opaque<string, 'GameSessionId'>

export type PlayerSession = Player & { accepted: boolean; ready: boolean }

export interface WordList {
  hintGiver: string[]
  guesser: string[]
}

export interface GameSession {
  sessionId: GameSessionId
  player1: PlayerSession
  player2: PlayerSession
  hintGiver: UserId | null
  status: SessionState
  turn: UserId | null
  word: string | null
  wordsList: WordList
  guessed: boolean
  startedAt: string | null
}
