import { test } from '@japa/runner'
import User from '#models/user'
import { CacheService } from '#services/cache/cache_service'
import testUtils from '@adonisjs/core/services/test_utils'
import type { GameSession, GameSessionId } from '#features/game_session/types/game_session'
import { randomUUID } from 'node:crypto'

test.group('Matchmaking - Accept matchmaking', (group) => {
  const cache = new CacheService()
  group.each.setup(async () => {
    await testUtils.db().migrate()
  })

  group.each.teardown(async () => {
    await cache.flush()
  })

  test('only user 1 should accept matchmaking', async ({ assert, client }) => {
    const user1 = await User.create({
      username: 'test1',
      email: 'test1@test.com',
      elo: 500,
      providerId: 1,
    })

    const user2 = await User.create({
      username: 'test2',
      email: 'test2@test.com',
      elo: 500,
      providerId: 1,
    })

    const responseUser1 = await client.post('/game/search').withCsrfToken().loginAs(user1)
    responseUser1.assertStatus(200)
    responseUser1.assertBody({
      message: 'Added to queue',
      queueCount: 1,
    })

    const responseUser2 = await client.post('/game/search').withCsrfToken().loginAs(user2)
    responseUser2.assertStatus(200)
    responseUser2.assertBody({
      message: 'Added to queue',
      queueCount: 2,
    })

    const playersCache = await cache.get('game:queue:players')
    assert.exists(playersCache)
    const players = JSON.parse(playersCache!)
    assert.equal(players.length, 2)

    const sessionId = randomUUID() as GameSessionId

    const sessionData: GameSession = {
      sessionId,
      player1: { ...players[0], accepted: false },
      player2: { ...players[1], accepted: false },
      turn: null,
      guessed: false,
      hintGiver: null,
      word: null,
      startedAt: null,
      wordsList: { hintGiver: [], guesser: [] },
    }

    await cache.set(`game:session:${sessionId}`, JSON.stringify(sessionData))

    /**
     * Accept matchmaking for user 1
     */
    const responseAccept = await client
      .post(`/game/session/${sessionId}/accept`)
      .withCsrfToken()
      .loginAs(user1)

    responseAccept.assertStatus(200)
    responseAccept.assertBody({
      message: 'Accepted',
    })

    const session = await cache.get(`game:session:${sessionId}`)
    const sessionParsed = JSON.parse(session!) as GameSession

    // User 1 should have accepted
    assert.isTrue(sessionParsed.player1.accepted)
    // User 2 should not have accepted
    assert.isFalse(sessionParsed.player2.accepted)
  })
})
