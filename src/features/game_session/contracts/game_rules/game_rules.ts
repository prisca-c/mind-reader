import type { GameRulesInterface } from '#features/game_session/contracts/game_rules/game_rules_interface'
import type { GameSession } from '#features/game_session/types/game_session'
import { ValidWordState, type ValidWordEnum } from '#features/game_session/enums/valid_word_state'

export class GameRules implements GameRulesInterface {
  validWord(session: GameSession, userId: string, answer: string): { status: ValidWordEnum } {
    const { word, hintGiver } = session
    if (!word) {
      return {
        status: ValidWordState.NOT_DEFINED,
      }
    }

    if (hintGiver === userId) {
      const matchReturn = {
        status: ValidWordState.MATCHES,
      }

      const validReturn = {
        status: ValidWordState.VALID,
      }

      return !(word.startsWith(answer.slice(0, 3)) || word.endsWith(answer.slice(-3)))
        ? validReturn
        : matchReturn
    }

    return {
      status: ValidWordState.VALID,
    }
  }

  validateAnswer(session: GameSession, answer: string, userId: string): boolean {
    const { word, hintGiver } = session
    if (!word) {
      return false
    }

    if (hintGiver !== userId) {
      return answer.toLowerCase() === word.toLowerCase()
    }

    return false
  }

  isAuthorizedPlayer(userId: string, player1Id: string, player2Id: string): boolean {
    return userId !== player1Id && userId !== player2Id
  }

  updateSessionForHintGiver(session: GameSession, answer: string): GameSession {
    const { player1, player2, hintGiver, wordsList } = session
    return {
      ...session,
      turn: hintGiver !== player1.id ? player1.id : player2.id,
      wordsList: {
        hintGiver: [...wordsList.hintGiver, answer],
        guesser: [...wordsList.guesser],
      },
    }
  }

  updateSessionForGuesser(session: GameSession, answer: string, isCorrect: boolean): GameSession {
    const { wordsList, hintGiver } = session
    return {
      ...session,
      turn: isCorrect ? null : hintGiver,
      guessed: isCorrect,
      wordsList: {
        hintGiver: [...wordsList.hintGiver],
        guesser: [...wordsList.guesser, answer],
      },
    }
  }
}
