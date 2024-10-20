import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import type { GameSession } from '#features/game_session/types/game_session'
import { CacheService } from '#services/cache/cache_service'
import env from '#start/env'

export default class GameSessionController {
  @inject()
  public async render({ inertia, auth, response, params }: HttpContext, cache: CacheService) {
    if (!auth.user) {
      return response.redirect('/login')
    }

    const user = auth.user
    const sessionId = params.sessionId
    const session = await cache.get(`game:session:${sessionId}`)
    const gameLength = env.get('GAME_LENGTH')

    // Redirect if game session does not exist
    if (!session) {
      return response.redirect('/game')
    }

    const { player1, player2, hintGiver, word, turn, wordsList, status, startedAt }: GameSession = JSON.parse(session)

    // Redirect if user is not part of the game session
    if (player1.id !== user.id && player2.id !== user.id) {
      return response.redirect('/game')
    }

    // Redirect if game session has ended
    if (startedAt) {
      const timeLeft: number = DateTime.fromISO(startedAt!).plus({ seconds: gameLength }).diffNow().as('seconds')

      if (timeLeft <= 0) {
        await cache.del(`game:session:${sessionId}`)
        return response.redirect('/game')
      }
    }

    const role = hintGiver === user.id ? 'hintGiver' : 'guesser'
    let guessWord = ''

    if (role === 'hintGiver') {
      guessWord = word!
    }

    return inertia.render('game_session', {
      sessionId: sessionId,
      user: user,
      role: role,
      word: guessWord,
      wordsList: wordsList,
      turn: turn === user.id,
      sessionState: status,
      sessionDate: startedAt,
      gameLength: gameLength,
    })
  }
}
