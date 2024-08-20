import type { UserId } from '#models/user'
import type {
  GameSession,
  GameSessionId,
  PlayerSession,
} from '#features/game_session/types/game_session'
import { SessionStateEnum } from '#features/game_session/enums/session_state'

export const player1: PlayerSession = {
  id: '1' as UserId,
  username: 'player1',
  elo: 1000,
  accepted: true,
  ready: false,
}

export const player2: PlayerSession = {
  id: '2' as UserId,
  username: 'player2',
  elo: 1000,
  accepted: true,
  ready: false,
}

export const session: GameSession = {
  sessionId: '1' as GameSessionId,
  status: SessionStateEnum.READY,
  player1: player1,
  player2: player2,
  hintGiver: player1.id as UserId,
  turn: player1.id as UserId,
  word: null,
  guessed: false,
  startedAt: '2024-01-01T00:00:00.000Z',
  wordsList: {
    hintGiver: [],
    guesser: [],
  },
}
