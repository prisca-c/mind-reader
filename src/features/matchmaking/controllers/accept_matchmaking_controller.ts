import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { GameSession } from '#features/game_session/types/game_session'
import { CacheService } from '#services/cache/cache_service'

export default class AcceptMatchmakingController {
  @inject()
  public async handle({ auth, response, params }: HttpContext, cache: CacheService) {
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
