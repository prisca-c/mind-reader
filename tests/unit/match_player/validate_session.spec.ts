import { test } from '@japa/runner'
import { session } from '#tests/utils/session_data'
import { MatchPlayerJob } from '#features/matchmaking/jobs/match_player_job'
import { CacheService } from '#services/cache/cache_service'
import { randomUUID } from 'node:crypto'
import type { GameSessionId } from '#features/game_session/types/game_session'
import { EventStreamService } from '#services/event_stream/event_stream_service'

test.group('MatchPlayer - Validate Session', (group) => {
  const cache = new CacheService()
  const eventStream = new EventStreamService()
  const job = new MatchPlayerJob(cache, eventStream)

  group.teardown(async () => {
    await cache.flush()
  })

  const players = [
    { ...session.player1, elo: 1000, accepted: false },
    { ...session.player2, elo: 1000, accepted: false },
  ]

  test('should return true when session is valid (both players accepted)', async ({ assert }) => {
    const sessionId = randomUUID()
    await job.createSession(players[0], players[1], sessionId as GameSessionId)

    const cacheSession = await cache.get(`game:session:${sessionId}`)
    const parsedSession = cacheSession ? JSON.parse(cacheSession) : null

    if (!parsedSession) {
      assert.fail('Session not found')
      return
    }

    parsedSession.player1.accepted = true
    parsedSession.player2.accepted = true

    await cache.set(`game:session:${sessionId}`, JSON.stringify(parsedSession))

    const result = await job.validateSession(sessionId as GameSessionId)

    assert.isTrue(result)
  })

  test('should return false when session is invalid (session not found)', async ({ assert }) => {
    const sessionId = 'invalid-session-id' as GameSessionId

    const result = await job.validateSession(sessionId)

    assert.isFalse(result)
  })

  test('should return false when session is invalid (one player not accepted)', async ({
    assert,
  }) => {
    const sessionId = randomUUID()
    await job.createSession(players[0], players[1], sessionId as GameSessionId)

    const cacheSession = await cache.get(`game:session:${sessionId}`)
    const parsedSession = cacheSession ? JSON.parse(cacheSession) : null

    if (!parsedSession) {
      assert.fail('Session not found')
      return
    }

    parsedSession.player1.accepted = true

    await cache.set(`game:session:${sessionId}`, JSON.stringify(parsedSession))

    const result = await job.validateSession(sessionId as GameSessionId)

    assert.isFalse(result)
  })
})
