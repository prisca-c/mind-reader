import { test } from '@japa/runner'
import User from '#models/user'
import redis from '@adonisjs/redis/services/main'

test.group('Matchmaking - Game search', () => {
  test('user should be added to matchmaking queue', async ({ assert, client }) => {
    const user = await User.create({
      username: 'test',
      email: 'test@test.com',
      elo: 500,
      providerId: 1,
    })

    const response = await client.post('/game/search').withCsrfToken().loginAs(user)

    const playersCache = await redis.get('game:queue:players')

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
})
