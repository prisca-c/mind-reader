import type { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'
import type { Player } from '#features/game_session/types/player'
import transmit from '@adonisjs/transmit/services/main'

export default class SearchMatchmakingController {
  async handle({ auth, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized()
    }

    const user = auth.user

    const playersL = await redis.get('game:queue:players')
    logger.info(playersL)

    const playersCache = await redis.get('game:queue:players')
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
      await redis.set('game:queue:players', JSON.stringify(players))
    }

    if (playerExists) {
      players.forEach((p: Player & { date: string }) => {
        if (p.id === user.id) {
          p.date = DateTime.now().toISO()
        }
      })
    }

    const queueCount = players.length
    await redis.set('game:queue:count', queueCount)

    transmit.broadcast('game/search', {
      queueCount: queueCount,
    })

    return response.ok({
      message: 'Added to queue',
      queueCount,
    })
  }
}
