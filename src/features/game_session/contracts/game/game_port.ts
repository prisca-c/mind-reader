import type { GameSession } from '#features/game_session/types/game_session'

export abstract class GamePort {
  abstract getSession(sessionId: string): Promise<GameSession | null>
  abstract updateSession(session: GameSession): Promise<void>
  abstract broadcastAnswer(session: GameSession, isOver: boolean, isCorrect: boolean): Promise<void>
  abstract broadcastError(session: GameSession): Promise<void>
  abstract saveToGameHistory(session: GameSession): Promise<void>
}
