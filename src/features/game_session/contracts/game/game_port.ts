import type { GameSession } from '#features/game_session/types/game_session'

export interface GamePort {
  getSession(sessionId: string): Promise<GameSession | null>
  updateSession(session: GameSession): Promise<void>
  broadcastAnswer(session: GameSession, isCorrect: boolean): Promise<void>
  broadcastError(session: GameSession): Promise<void>
}
