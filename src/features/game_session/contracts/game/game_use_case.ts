import type { HttpContext } from '@adonisjs/core/http'
import type { GameSession, GameSessionId } from '#features/game_session/types/game_session'
import { inject } from '@adonisjs/core'
import { GamePort } from '#features/game_session/contracts/game/game_port'

@inject()
export class GameUseCase {
  private gamePort: GamePort

  constructor(gamePort: GamePort) {
    this.gamePort = gamePort
  }

  async handle(ctx: HttpContext): Promise<void> {
    const { auth, request, response, params } = ctx
    if (!auth.user) {
      return response.unauthorized()
    }

    const user = auth.user
    const sessionId: GameSessionId = params.sessionId
    const session = await this.gamePort.getSession(sessionId)
    if (!session) {
      return response.notFound()
    }

    const { player1, player2, hintGiver, word, wordsList } = session
    const answer: string = request.input('answer')

    if (player1.id !== user.id && player2.id !== user.id) {
      return response.unauthorized()
    }

    if (!hintGiver || !word || !player1 || !player2) {
      return response.badRequest({ message: 'Invalid game session' })
    }

    if (hintGiver === user.id) {
      if (word.startsWith(answer.slice(0, 3)) || word.endsWith(answer.slice(-3))) {
        await this.gamePort.broadcastError(session)
        return response.ok({ message: 'Error' })
      }

      const updatedSession: GameSession = {
        ...session,
        turn: hintGiver !== player1.id ? player1.id : player2.id,
        wordsList: {
          hintGiver: [...wordsList.hintGiver, answer],
          guesser: [...wordsList.guesser],
        },
      }
      await this.gamePort.updateSession(updatedSession)
      await this.gamePort.broadcastAnswer(updatedSession, false)
      return response.ok({ message: 'Success' })
    }

    if (hintGiver !== user.id) {
      if (answer.toLowerCase() === word.toLowerCase()) {
        const updatedSession: GameSession = {
          ...session,
          turn: null,
          guessed: true,
          wordsList: {
            hintGiver: [...wordsList.hintGiver],
            guesser: [...wordsList.guesser, answer],
          },
        }
        await this.#handleSessionUpdate(updatedSession, true, true)
        return response.ok({ message: 'Success' })
      }

      let updatedSession: GameSession = {
        ...session,
        turn: hintGiver,
        wordsList: {
          hintGiver: [...wordsList.hintGiver],
          guesser: [...wordsList.guesser, answer],
        },
      }

      if (updatedSession.wordsList.guesser.length === 5) {
        updatedSession = {
          ...updatedSession,
          turn: null,
          guessed: false,
        }
        await this.#handleSessionUpdate(updatedSession, true)
        return response.ok({ message: 'Success' })
      }

      await this.#handleSessionUpdate(updatedSession, false)
      return response.ok({ message: 'Answer sent' })
    }

    return response.badRequest({ message: 'Invalid user' })
  }

  async #handleSessionUpdate(
    updatedSession: GameSession,
    saveGame: boolean,
    win = false
  ): Promise<void> {
    await this.gamePort.updateSession(updatedSession)
    await this.gamePort.broadcastAnswer(updatedSession, win)
    if (saveGame) {
      await this.gamePort.saveToGameHistory(updatedSession)
    }
  }
}
