import { test } from '@japa/runner'
import { session } from '#tests/utils/session_data'
import { MatchPlayerJob } from '#features/matchmaking/jobs/match_player_job'
import { CacheService } from '#services/cache/cache_service'
import { randomUUID } from 'node:crypto'
import type { GameSessionId } from '#features/game_session/types/game_session'
import { EventStreamService } from '#services/event_stream/event_stream_service'

test.group('MatchPlayer - createSession', (group) => {
  const cache = new CacheService()
  const eventStream = new EventStreamService()
  const job = new MatchPlayerJob(cache, eventStream)

  group.teardown(async () => {
    await cache.flush()
  })

  test('should create a new session', async ({ assert }) => {
    const players = [
      { ...session.player1, elo: 1000, accepted: false },
      { ...session.player2, elo: 1000, accepted: false },
    ]

    const sessionId = randomUUID()
    const result = await job.createSession(players[0], players[1], sessionId as GameSessionId)

    assert.deepEqual(result, {
      sessionId: sessionId,
      player1: players[0],
      player2: players[1],
      turn: null,
      guessed: false,
      hintGiver: null,
      word: null,
      startedAt: null,
      wordsList: { hintGiver: [], guesser: [] },
    })
  })
})
