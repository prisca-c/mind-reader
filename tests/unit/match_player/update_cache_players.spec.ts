import { randomUUID } from 'node:crypto'
import { test } from '@japa/runner'
import type { GameSessionId } from '#features/game_session/types/game_session'
import { MatchPlayerJob } from '#features/matchmaking/jobs/match_player_job'
import Word from '#models/word'
import { CacheService } from '#services/cache/cache_service'
import { EventStreamService } from '#services/event_stream/event_stream_service'
import { session } from '#tests/utils/session_data'

test.group('MatchPlayer - updateCachePlayers', (group) => {
  const cache = new CacheService()
  const eventStream = new EventStreamService()
  const job = new MatchPlayerJob(cache, eventStream)

  group.teardown(async () => {
    await cache.flush()
  })

  test('should update the players in the cache', async ({ assert }) => {
    const players = [
      { ...session.player1, elo: 1000 },
      { ...session.player2, elo: 1000 },
    ]

    await cache.set('game:queue:players', JSON.stringify([...players]))

    const cachedPlayers = await job.getPlayersFromCache()
    assert.deepEqual(cachedPlayers, players)

    const newSession = await job.createSession(players[0], players[1], randomUUID() as GameSessionId)
    assert.isNotNull(session)

    const parsedSession = JSON.parse((await cache.get(`game:session:${newSession.sessionId}`)) || '')
    assert.isNotNull(parsedSession)

    const word = await Word.create({ name: 'test', difficulty: 1, language: 'en' })

    await job.startGameSession(newSession.sessionId, word, players, players[0], players[1])

    await job.updateCachePlayers()

    const updatedPlayers = await job.getPlayersFromCache()
    const queueCount = await cache.get('game:queue:count')
    assert.deepEqual(updatedPlayers, [])
    assert.equal(queueCount, '0')
  })
})
