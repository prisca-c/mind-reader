import type { HttpContext } from '@adonisjs/core/http'
import { Cache } from '#services/cache/cache'
import { GameSession } from '#features/game_session/types/game_session'
import { inject } from '@adonisjs/core'

export default class AcceptMatchmakingController {
  @inject()
  async handle({ auth, response, params }: HttpContext, cache: Cache) {
    if (!auth.user) {
      return response.unauthorized()
    }

    const sessionId = params.sessionId
    const session = await cache.get(`game:session:${sessionId}`)
    const user = auth.user
    if (!session) {
      return response.notFound()
    }

    const { player1, player2 } = JSON.parse(session) as GameSession

    if (player1.id === user.id) {
      player1.accepted = true
    }

    if (player2.id === user.id) {
      player2.accepted = true
    }

    const updatedSession: GameSession = {
      ...JSON.parse(session),
      player1,
      player2,
    }

    await cache.set(`game:session:${sessionId}`, JSON.stringify(updatedSession))

    return response.ok({
      message: 'Accepted',
    })
  }
}
