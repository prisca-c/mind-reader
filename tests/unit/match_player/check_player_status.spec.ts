import { test } from '@japa/runner'
import { session } from '#tests/utils/session_data'
import { MatchPlayerJob } from '#features/matchmaking/jobs/match_player_job'
import { CacheService } from '#services/cache/cache_service'
import { randomUUID } from 'node:crypto'
import type { GameSessionId } from '#features/game_session/types/game_session'
import { EventStreamService } from '#services/event_stream/event_stream_service'

test.group('MatchPlayer - checkPlayerStatus', () => {
  const cache = new CacheService()
  const eventStream = new EventStreamService()
  const job = new MatchPlayerJob(cache, eventStream)

  test('should return true if both players accepted', async ({ assert }) => {
    const players = [
      { ...session.player1, elo: 1000 },
      { ...session.player2, elo: 1000 },
    ]

    const result = await job.createSession(players[0], players[1], randomUUID() as GameSessionId)
    assert.isNotNull(result)

    const parsedSession = JSON.parse((await cache.get(`game:session:${result.sessionId}`)) || '')
    assert.isNotNull(parsedSession)

    parsedSession.player1.accepted = true
    parsedSession.player2.accepted = true

    await cache.set(`game:session:${result.sessionId}`, JSON.stringify(parsedSession))

    const status = await job.checkPlayerStatus(result.sessionId)
    assert.isTrue(status)
  })

  test('should return false if one player did not accept', async ({ assert }) => {
    const players = [
      { ...session.player1, elo: 1000 },
      { ...session.player2, elo: 1000 },
    ]

    const result = await job.createSession(players[0], players[1], randomUUID() as GameSessionId)
    assert.isNotNull(result)

    const parsedSession = JSON.parse((await cache.get(`game:session:${result.sessionId}`)) || '')
    assert.isNotNull(parsedSession)

    parsedSession.player1.accepted = true
    parsedSession.player2.accepted = false

    await cache.set(`game:session:${result.sessionId}`, JSON.stringify(parsedSession))

    const status = await job.checkPlayerStatus(result.sessionId)
    assert.isFalse(status)
  })
})
