import type { GameRulesInterface } from '#features/game_session/contracts/game_rules/game_rules_interface'
import { type ValidWordState, ValidWordStateEnum } from '#features/game_session/enums/valid_word_state'
import type { GameSession } from '#features/game_session/types/game_session'
import { normalizeLatin } from '#helpers/text'

export class GameRules implements GameRulesInterface {
  public validWord(session: GameSession, userId: string, answer: string): { status: ValidWordState } {
    const { word, hintGiver } = session
    if (!word) {
      return {
        status: ValidWordStateEnum.NOT_DEFINED,
      }
    }

    if (hintGiver === userId) {
      const matchReturn = {
        status: ValidWordStateEnum.MATCHES,
      }

      const validReturn = {
        status: ValidWordStateEnum.VALID,
      }

      // Convert words in case there's latin character to compare them
      const normalizeAnswer = normalizeLatin(answer).toLowerCase()
      const normalizeWord = normalizeLatin(word).toLowerCase()

      return !(
        normalizeWord.startsWith(normalizeAnswer.slice(0, 3)) || normalizeWord.endsWith(normalizeAnswer.slice(-3))
      )
        ? validReturn
        : matchReturn
    }

    return {
      status: ValidWordStateEnum.VALID,
    }
  }

  public validateAnswer(session: GameSession, answer: string, userId: string): boolean {
    const { word, hintGiver } = session
    if (!word) {
      return false
    }

    if (hintGiver !== userId) {
      // Convert words in case there's latin character to compare them
      const normalizeAnswer = normalizeLatin(answer)
      const normalizeWord = normalizeLatin(word)
      return normalizeAnswer.toLowerCase() === normalizeWord.toLowerCase()
    }

    return false
  }

  public isAuthorizedPlayer(userId: string, player1Id: string, player2Id: string): boolean {
    return userId === player1Id || userId === player2Id
  }

  public updateSessionForHintGiver(session: GameSession, answer: string): GameSession {
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

  public updateSessionForGuesser(
    session: GameSession,
    answer: string,
    isOver: boolean,
    isCorrect: boolean,
  ): GameSession {
    const { wordsList, hintGiver } = session
    return {
      ...session,
      turn: isOver ? null : hintGiver,
      guessed: isCorrect,
      wordsList: {
        hintGiver: [...wordsList.hintGiver],
        guesser: [...wordsList.guesser, answer],
      },
    }
  }
}
