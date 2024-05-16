import redis from '@adonisjs/redis/services/main'
import { DateTime } from 'luxon'
import type { Player } from '#types/player'
import transmit from '@adonisjs/transmit/services/main'

interface ClearSearchPayload {
  minTime: number // in minutes
}

export class ClearSearchJob {
  async handle(payload: ClearSearchPayload) {
    const playersCache = await redis.get('game:queue:players')
    const players = playersCache ? JSON.parse(playersCache) : []

    const now = DateTime.now()
    const minTime = now.minus({ minutes: payload.minTime })

    const newPlayers = players.filter((p: Player) => {
      const date = DateTime.fromISO(p.date)
      transmit.broadcast(`game/user/${p.id}`, { message: 'Removed from queue' })
      return date > minTime
    })

    await redis.set('game:queue:players', JSON.stringify(newPlayers))
  }
}
