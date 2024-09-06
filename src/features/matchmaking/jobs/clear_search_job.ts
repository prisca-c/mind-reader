import { CacheService } from '#services/cache/cache_service'
import { DateTime } from 'luxon'
import type { Player } from '#features/game_session/types/player'
import { EventStreamService } from '#services/event_stream/event_stream_service'

interface ClearSearchPayload {
  minTime: number // in minutes
}

export class ClearSearchJob {
  async handle(payload: ClearSearchPayload) {
    const cache = new CacheService()
    const eventStream = new EventStreamService()
    const playersCache = await cache.get('game:queue:players')
    const players = playersCache ? JSON.parse(playersCache) : []

    const now = DateTime.now()
    const minTime = now.minus({ minutes: payload.minTime })

    const newPlayers = players.filter((p: Player & { date: string }) => {
      const date = DateTime.fromISO(p.date)
      eventStream.broadcast(`game/user/${p.id}`, { message: 'Removed from queue' })
      return date > minTime
    })

    await cache.set('game:queue:players', JSON.stringify(newPlayers))
  }
}
