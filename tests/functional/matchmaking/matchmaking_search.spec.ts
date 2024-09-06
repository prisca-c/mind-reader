import { test } from '@japa/runner'
import User from '#models/user'
import { CacheService } from '#services/cache/cache_service'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Matchmaking - Game search', (group) => {
  const cache = new CacheService()
  group.each.setup(() => testUtils.db().migrate())
  group.each.teardown(async () => {
    await cache.flush()
  })
  test('user should be added to matchmaking queue', async ({ assert, client }) => {
    const user = await User.create({
      username: 'test',
      email: 'test@test.com',
      elo: 500,
      providerId: 1,
    })

    const response = await client.post('/game/search').withCsrfToken().loginAs(user)

    const playersCache = await cache.get('game:queue:players')

    assert.exists(playersCache)

    const player = JSON.parse(playersCache!)[0]

    assert.equal(JSON.parse(playersCache!).length, 1)
    assert.equal(player.id, user.id)
    assert.equal(player.username, user.username)
    assert.equal(player.elo, user.elo)
    assert.exists(player.date)

    response.assertStatus(200)
    response.assertBody({
      message: 'Added to queue',
      queueCount: 1,
    })
  })

  test('user should not be added twice to matchmaking queue', async ({ assert, client }) => {
    const user = await User.firstOrCreate({
      username: 'test',
      email: 'test@test.com',
      elo: 500,
      providerId: 1,
    })

    /**
     * Add user to queue
     */
    await client.post('/game/search').withCsrfToken().loginAs(user)
    const playersCache = await cache.get('game:queue:players')
    assert.exists(playersCache)
    const playerBefore = JSON.parse(playersCache!)[0]
    assert.equal(JSON.parse(playersCache!).length, 1)
    assert.equal(playerBefore.id, user.id)
    assert.exists(playerBefore.date)

    /**
     * Add user to queue again
     */
    const response = await client.post('/game/search').withCsrfToken().loginAs(user)
    const playersCacheAfter = await cache.get('game:queue:players')
    assert.exists(playersCacheAfter)
    const playerAfter = JSON.parse(playersCacheAfter!)[0]
    assert.equal(JSON.parse(playersCacheAfter!).length, 1)
    assert.equal(playerAfter.id, user.id)
    assert.exists(playerAfter.date)

    response.assertStatus(200)
    response.assertBody({
      message: 'Added to queue',
      queueCount: 1,
    })
  })

  test('second user should be added to matchmaking queue', async ({ assert, client }) => {
    const user1 = await User.create({
      username: 'test1',
      email: 'test1@test1.com',
      elo: 500,
      providerId: 1,
    })

    const user2 = await User.create({
      username: 'test2',
      email: 'test2@test.com',
      elo: 500,
      providerId: 1,
    })

    await client.post('/game/search').withCsrfToken().loginAs(user1)
    await client.post('/game/search').withCsrfToken().loginAs(user2)

    const playersCache = await cache.get('game:queue:players')
    assert.exists(playersCache)
    const players = JSON.parse(playersCache!)

    assert.equal(players.length, 2)

    const player1 = players.find((player: any) => player.id === user1.id)
    assert.exists(player1)

    const player2 = players.find((player: any) => player.id === user2.id)
    assert.exists(player2)

    const queueCount = await cache.get('game:queue:count')
    assert.equal(queueCount, 2)

    const response = await client.post('/game/search').withCsrfToken().loginAs(user2)
    response.assertStatus(200)
    response.assertBody({
      message: 'Added to queue',
      queueCount: 2,
    })
  })
})
