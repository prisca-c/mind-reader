import { test } from '@japa/runner'
import { MatchPlayerJob } from '#features/matchmaking/jobs/match_player_job'
import { CacheService } from '#services/cache/cache_service'
import { Player } from '#features/game_session/types/player'
import type { UserId } from '#models/user'
import { EventStreamService } from '#services/event_stream/event_stream_service'

test.group('Matchmaking - Get players from cache', (group) => {
  const cache = new CacheService()
  const eventStream = new EventStreamService()
  const job = new MatchPlayerJob(cache, eventStream)

  group.teardown(async () => {
    await cache.flush()
  })

  test('should return empty array when no players in cache', async ({ assert }) => {
    const players = await job.getPlayersFromCache()

    assert.deepEqual(players, [])
  })

  test('should return players from cache', async ({ assert }) => {
    const players: Player[] = [
      { id: 'id' as UserId, username: 'player1', elo: 1000 },
      { id: 'id' as UserId, username: 'player2', elo: 1000 },
    ]
    await cache.set('game:queue:players', JSON.stringify([...players]))

    const playersCache = await job.getPlayersFromCache()

    assert.deepEqual(playersCache, players)
  })
})
