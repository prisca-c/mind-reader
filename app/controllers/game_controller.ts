import type { HttpContext } from '@adonisjs/core/http'
import transmit from '@adonisjs/transmit/services/main'
import redis from '@adonisjs/redis/services/main'
import logger from '@adonisjs/core/services/logger'
import type { UserId } from '#models/user'
import { DateTime } from 'luxon'

type Player = {
  id: UserId
  username: string
  elo: number
  date: DateTime
}

export default class GameController {
  async searchingQueue({ auth, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized()
    }

    const user = auth.user

    const playersL = await redis.get('game:queue:players')
    logger.info(playersL)

    const playersCache = await redis.get('game:queue:players')
    const players = playersCache ? JSON.parse(playersCache) : []
    const player = { id: user.id, username: user.username, elo: user.elo, date: DateTime.now() }

    const playerExists = players.find((p: Player) => p.id === user.id)

    if (!playerExists) {
      players.push(player)
      await redis.set('game:queue:players', JSON.stringify(players))
    }

    if (playerExists) {
      players.forEach((p: Player) => {
        if (p.id === user.id) {
          p.date = DateTime.now()
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
}
