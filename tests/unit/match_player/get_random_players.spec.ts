import { test } from '@japa/runner'
import { MatchPlayerJob } from '#features/matchmaking/jobs/match_player_job'
import { CacheService } from '#services/cache/cache_service'
import { Player } from '#features/game_session/types/player'
import type { UserId } from '#models/user'

test.group('Matchmaking - Get Random Players', () => {
  test('should return 2 different players', async ({ assert }) => {
    const cache = new CacheService()
    const job = new MatchPlayerJob(cache)
    const players: Player[] = [
      { id: 'id1' as UserId, username: 'player1', elo: 1000 },
      { id: 'id2' as UserId, username: 'player2', elo: 1000 },
      { id: 'id3' as UserId, username: 'player3', elo: 1000 },
      { id: 'id4' as UserId, username: 'player4', elo: 1000 },
    ]

    const result = job.getRandomPlayers(players)

    assert.lengthOf(result, 2)
    assert.notDeepEqual(result[0].id, result[1].id)
    assert.containsSubset(players, result)
  })

  test('should throw error when not enough players', async ({ assert }) => {
    const cache = new CacheService()
    const job = new MatchPlayerJob(cache)
    const players: Player[] = [{ id: 'id1' as UserId, username: 'player1', elo: 1000 }]

    const result = () => job.getRandomPlayers(players)

    assert.throws(result, 'Not enough players')
  })
})
