import type { GameSession } from '#features/game_session/types/game_session'

export abstract class GamePort {
  public abstract getSession(sessionId: string): Promise<GameSession | null>
  public abstract updateSession(session: GameSession): Promise<void>
  public abstract broadcastAnswer(session: GameSession, isOver: boolean, isCorrect: boolean): Promise<void>
  public abstract broadcastError(session: GameSession): Promise<void>
  public abstract saveToGameHistory(session: GameSession): Promise<void>
}
