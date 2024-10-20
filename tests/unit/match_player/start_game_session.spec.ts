import { randomUUID } from 'node:crypto'
import { test } from '@japa/runner'
import { SessionStateEnum } from '#features/game_session/enums/session_state'
import type { GameSessionId } from '#features/game_session/types/game_session'
import { MatchPlayerJob } from '#features/matchmaking/jobs/match_player_job'
import Word from '#models/word'
import { CacheService } from '#services/cache/cache_service'
import { EventStreamService } from '#services/event_stream/event_stream_service'
import { session } from '#tests/utils/session_data'

test.group('MatchPlayer - startGameSession', (group) => {
  const cache = new CacheService()
  const eventStream = new EventStreamService()
  const job = new MatchPlayerJob(cache, eventStream)

  group.teardown(async () => {
    await cache.flush()
  })

  test('should start a new game session', async ({ assert }) => {
    const players = [{ ...session.player1 }, { ...session.player2 }]

    const sessionId = randomUUID()

    const date = '2021-10-10T10:00:00.000Z'

    const newSession = await job.createSession(players[0], players[1], sessionId as GameSessionId)

    const word = await Word.create({ name: 'test', difficulty: 1, language: 'en' })
    await job.startGameSession(newSession.sessionId, word, players, players[0], players[1])

    // Get the session from cache
    const cachedSession = JSON.parse((await cache.get(`game:session:${newSession.sessionId}`)) || '')
    assert.isNotNull(cachedSession)

    /**
     * Update the session to set the players as accepted
     * + set date, hint giver and the turn to avoid random values in the test
     */
    await cache.set(
      `game:session:${newSession.sessionId}`,
      JSON.stringify({
        ...cachedSession,
        status: SessionStateEnum.PLAYING,
        player1: { ...players[0], accepted: true },
        player2: { ...players[1], accepted: true },
        hintGiver: players[0].id,
        turn: players[0].id,
        startedAt: date,
      }),
    )

    // Get updated session
    const result = JSON.parse((await cache.get(`game:session:${newSession.sessionId}`)) || '')
    assert.isNotNull(result)

    // Check if the session is correct after starting the game
    assert.deepEqual(result, {
      sessionId: newSession.sessionId,
      player1: players[0],
      status: SessionStateEnum.PLAYING,
      player2: players[1],
      turn: players[0].id,
      guessed: false,
      hintGiver: players[0].id,
      word: word.name,
      startedAt: date,
      wordsList: { hintGiver: [], guesser: [] },
    })
  })
})
