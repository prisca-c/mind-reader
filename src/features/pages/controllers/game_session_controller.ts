import type { HttpContext } from '@adonisjs/core/http'
import type { GameSession } from '#features/game_session/types/game_session'
import redis from '@adonisjs/redis/services/main'

export default class GameSessionController {
  async render({ inertia, auth, response, params }: HttpContext) {
    if (!auth.user) {
      return response.redirect('/login')
    }

    const user = auth.user
    const sessionId = params.sessionId
    const session = await redis.get(`game:session:${sessionId}`)

    if (!session) {
      return response.redirect('/game')
    }

    const { player1, player2, hintGiver, word, turn, wordsList }: GameSession = JSON.parse(session)

    if (player1.id !== user.id && player2.id !== user.id) {
      return response.redirect('/game')
    }

    const role = hintGiver === user.id ? 'hintGiver' : 'guesser'
    let guessWord = ''

    if (role === 'hintGiver') {
      guessWord = word!
    }

    return inertia.render('game_session', {
      user: user,
      role: role,
      word: guessWord,
      wordsList: wordsList,
      turn: turn === user.id,
    })
  }
}
