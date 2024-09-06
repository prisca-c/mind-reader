import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { CacheService } from '#services/cache/cache_service'
import { EventStreamService } from '#services/event_stream/event_stream_service'
import { assert } from '#helpers/assert'
import { Player } from '#features/game_session/types/player'

export default class CancelMatchmakingController {
  @inject()
  async handle(
    { auth, response }: HttpContext,
    cache: CacheService,
    eventStream: EventStreamService
  ) {
    const authCheck = await auth.use('web').check()
    if (!authCheck) {
      return response.unauthorized()
    }
    const user = auth.user
    assert(user)

    const playersCache = await cache.get('game:queue:players')
    const players = playersCache ? JSON.parse(playersCache) : []

    const playerExists = players.find((p: Player & { date: string }) => p.id === user.id)

    if (playerExists) {
      players.forEach((p: Player & { date: string }) => {
        if (p.id === user.id) {
          players.splice(players.indexOf(p), 1)
        }
      })
      await cache.set('game:queue:players', JSON.stringify(players))
    }

    const queueCount = players.length
    await cache.set('game:queue:count', queueCount)
    eventStream.broadcast('game/search', {
      queueCount: queueCount,
    })

    return response.ok({
      message: 'You have been removed from the matchmaking queue',
    })
  }
}
