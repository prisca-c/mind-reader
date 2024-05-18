import type { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'
import type { GameSession } from '#types/game_session'

export default class PagesController {
  login({ inertia }: HttpContext) {
    return inertia.render('login')
  }

  home({ inertia }: HttpContext) {
    return inertia.render('home')
  }

  game({ inertia, auth, response }: HttpContext) {
    if (!auth.user) {
      return response.redirect('/login')
    }

    return inertia.render('game')
  }

  search({ inertia, auth, response }: HttpContext) {
    if (!auth.user) {
      return response.redirect('/login')
    }

    return inertia.render('search', {
      user: auth.user,
    })
  }

  async gameSession({ inertia, auth, response, params }: HttpContext) {
    if (!auth.user) {
      return response.redirect('/login')
    }

    const user = auth.user
    const sessionId = params.sessionId
    const session = await redis.get(`game:session:${sessionId}`)
    if (!session) {
      return response.redirect('/game')
    }

    const { player1, player2, hintGiver, word, turn, wordsList } = JSON.parse(
      session
    ) as GameSession
    if (player1.id !== user.id && player2.id !== user.id) {
      return response.redirect('/game')
    }

    let guessWord = ''

    if (hintGiver && hintGiver === user.id) {
      guessWord = word!
    }

    return inertia.render('game_session', {
      sessionId: params.sessionId,
      user: user,
      word: guessWord,
      wordsList: wordsList,
      turn: turn === user.id,
    })
  }
}
