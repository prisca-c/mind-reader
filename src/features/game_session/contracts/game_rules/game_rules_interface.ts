import type { GameSession } from '#features/game_session/types/game_session'

export interface GameRulesInterface {
  validWord(session: GameSession, userId: string, answer: string): boolean
  validateAnswer(session: GameSession, answer: string, userId: string): boolean
  isGuesser(userId: string, player1Id: string, player2Id: string): boolean
  updateSessionForHintGiver(session: GameSession, answer: string): GameSession
  updateSessionForGuesser(session: GameSession, answer: string, isCorrect: boolean): GameSession
}
