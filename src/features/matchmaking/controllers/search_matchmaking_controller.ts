import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'
import { GameSession } from '#features/game_session/types/game_session'
import type { Player } from '#features/game_session/types/player'
import { assert } from '#helpers/assert'
import { CacheService } from '#services/cache/cache_service'
import { EventStreamService } from '#services/event_stream/event_stream_service'

export default class SearchMatchmakingController {
  @inject()
  public async handle({ auth, response }: HttpContext, cache: CacheService, eventStream: EventStreamService) {
    const authCheck = await auth.use('web').check()
    if (!authCheck) {
      return response.unauthorized()
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

    if (sessionId) {
      return response.redirect('game/session/' + sessionId)
    }

    const playersCache = await cache.get('game:queue:players')
    logger.debug('playersCache', playersCache)
    const players = playersCache ? JSON.parse(playersCache) : []
    const player = {
      id: user.id,
      username: user.username,
      elo: user.elo,
      date: DateTime.now().toISO(),
    }

    const playerExists = players.find((p: Player & { date: string }) => p.id === user.id)

    if (!playerExists) {
      players.push(player)
      await cache.set('game:queue:players', JSON.stringify(players))
    }

    if (playerExists) {
      players.forEach((p: Player & { date: string }) => {
        if (p.id === user.id) {
          p.date = DateTime.now().toISO()
        }
      })
    }

    const queueCount = players.length
    await cache.set('game:queue:count', queueCount)

    eventStream.broadcast('game/search', {
      queueCount: queueCount,
    })

    return response.ok({
      message: 'Added to queue',
      queueCount,
    })
  }
}
