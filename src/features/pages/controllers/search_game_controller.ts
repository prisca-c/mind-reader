import type { HttpContext } from '@adonisjs/core/http'
import { CacheService } from '#services/cache/cache_service'
import { inject } from '@adonisjs/core'
import { assert } from '#helpers/assert'
import { GameSession } from '#features/game_session/types/game_session'

export default class SearchGameController {
  @inject()
  async render({ inertia, auth, response }: HttpContext, cache: CacheService) {
    if (!(await auth.check())) {
      return response.redirect('/login')
    }

    const user = auth.user
    assert(user)

    const sessions = await cache.keys('game:session:*')

    const existingSession = sessions.filter(async (session) => {
      const sessionData = await cache.get(session)
      if (sessionData) {
        const cachedSession: GameSession = JSON.parse(sessionData)
        return cachedSession.player1.id === user.id || cachedSession.player2.id === user.id
      }
    })

    const sessionId = existingSession.length > 0 ? existingSession[0].split(':')[2] : null

    return inertia.render('search', {
      user: user,
      existingSession: sessionId,
    })
  }
}
