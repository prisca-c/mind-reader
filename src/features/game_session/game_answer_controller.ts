import type { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'
import type { GameSession } from '#types/game_session'
import transmit from '@adonisjs/transmit/services/main'
import { GameStatus } from '#enums/game_status'

export default class GameAnswerController {
  async handle({ auth, response, params, request }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized()
    }

    const user = auth.user
    const sessionId = params.sessionId
    const session = await redis.get(`game:session:${sessionId}`)
    if (!session) {
      return response.notFound()
    }

    const { player1, player2, hintGiver, word, wordsList } = JSON.parse(session) as GameSession
    const answer = request.input('answer')

    if (player1.id !== user.id && player2.id !== user.id) {
      return response.unauthorized()
    }

    if (!hintGiver || !word || !player1 || !player2) {
      return response.badRequest({ message: 'Invalid game session' })
    }

    if (hintGiver === user.id) {
      if (word.startsWith(answer.slice(0, 3)) || word.endsWith(answer.slice(-3))) {
        transmit.broadcast(`game/session/${sessionId}/user/${player1.id}`, { status: 'error' })
        transmit.broadcast(`game/session/${sessionId}/user/${player2.id}`, { status: 'error' })
        return response.ok({ message: 'Error' })
      }

      transmit.broadcast(`game/session/${sessionId}/user/${player1.id}`, {
        status: 'success',
        wordsList: JSON.stringify({
          hintGiver: [...wordsList.hintGiver, answer],
          guesser: [...wordsList.guesser],
        }),
        turn: hintGiver !== player1.id,
      })
      transmit.broadcast(`game/session/${sessionId}/user/${player2.id}`, {
        status: 'success',
        wordsList: JSON.stringify({
          hintGiver: [...wordsList.hintGiver, answer],
          guesser: [...wordsList.guesser],
        }),
        turn: hintGiver !== player2.id,
      })

      const updatedSession: GameSession = {
        ...JSON.parse(session),
        turn: hintGiver !== player1.id ? player1.id : player2.id,
        wordsList: {
          hintGiver: [...wordsList.hintGiver, answer],
          guesser: [...wordsList.guesser],
        },
      }
      await redis.set(`game:session:${sessionId}`, JSON.stringify(updatedSession))

      return response.ok({ message: 'Success' })
    }

    if (hintGiver !== user.id) {
      if (answer.toLowerCase() === word.toLowerCase()) {
        transmit.broadcast(`game/session/${sessionId}/user/${player1.id}`, {
          status: GameStatus.WIN,
          wordsList: JSON.stringify({
            hintGiver: [...wordsList.hintGiver],
            guesser: [...wordsList.guesser, answer],
          }),
        })
        transmit.broadcast(`game/session/${sessionId}/user/${player2.id}`, {
          status: GameStatus.WIN,
          wordsList: JSON.stringify({
            hintGiver: [...wordsList.hintGiver],
            guesser: [...wordsList.guesser, answer],
          }),
        })

        const updatedSession: GameSession = {
          ...JSON.parse(session),
          turn: null,
          guessed: true,
          wordsList: {
            hintGiver: [...wordsList.hintGiver],
            guesser: [...wordsList.guesser, answer],
          },
        }
        await redis.set(`game:session:${sessionId}`, JSON.stringify(updatedSession))

        return response.ok({ message: 'Success' })
      }

      transmit.broadcast(`game/session/${sessionId}/user/${hintGiver}`, {
        status: 'answer',
        wordsList: JSON.stringify({
          hintGiver: [...wordsList.hintGiver],
          guesser: [...wordsList.guesser, answer],
        }),
        turn: true,
      })

      transmit.broadcast(`game/session/${sessionId}/user/${user.id}`, {
        status: 'answer',
        wordsList: JSON.stringify({
          hintGiver: [...wordsList.hintGiver],
          guesser: [...wordsList.guesser, answer],
        }),
        turn: false,
      })

      const updatedSession: GameSession = {
        ...JSON.parse(session),
        turn: hintGiver,
        wordsList: {
          hintGiver: [...wordsList.hintGiver],
          guesser: [...wordsList.guesser, answer],
        },
      }
      await redis.set(`game:session:${sessionId}`, JSON.stringify(updatedSession))

      return response.ok({ message: 'Answer sent' })
    }

    return response.badRequest({ message: 'Invalid user' })
  }
}
