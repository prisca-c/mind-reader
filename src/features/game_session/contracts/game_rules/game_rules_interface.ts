import type { GameSession } from '#features/game_session/types/game_session'
import type { ValidWordState } from '#features/game_session/enums/valid_word_state'

export interface GameRulesInterface {
  validWord(session: GameSession, userId: string, answer: string): { status: ValidWordState }
  validateAnswer(session: GameSession, answer: string, userId: string): boolean
  isAuthorizedPlayer(userId: string, player1Id: string, player2Id: string): boolean
  updateSessionForHintGiver(session: GameSession, answer: string): GameSession
  updateSessionForGuesser(
    session: GameSession,
    answer: string,
    isOver: boolean,
    isCorrect: boolean
  ): GameSession
}
