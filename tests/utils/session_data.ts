import type { Player } from '#features/game_session/types/player'
import type { UserId } from '#models/user'
import type { GameSession, GameSessionId } from '#features/game_session/types/game_session'

export const player1: Player & { accepted: boolean } = {
  id: '1' as UserId,
  username: 'player1',
  elo: 1000,
  accepted: true,
}

export const player2: Player & { accepted: boolean } = {
  id: '2' as UserId,
  username: 'player2',
  elo: 1000,
  accepted: true,
}

export const session: GameSession = {
  sessionId: '1' as GameSessionId,
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
