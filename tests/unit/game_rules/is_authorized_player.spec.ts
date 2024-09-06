import { test } from '@japa/runner'
import { GameRules } from '#features/game_session/contracts/game_rules/game_rules'
import { player1, player2, session } from '#tests/utils/session_data'

test.group('GameRules - isAuthorizedPlayer', () => {
  const gameRules = new GameRules()

  const player1Id = player1.id
  const player2Id = player2.id
  const player3Id = '3'

  const sessionCopy = {
    ...session,
    player1: { ...player1, id: player1Id },
    player2: { ...player2, id: player2Id },
  }

  test('should return true when player1 is one of the 2 players in the game session', ({
    assert,
  }) => {
    const result = gameRules.isAuthorizedPlayer(
      player1Id,
      sessionCopy.player1.id,
      sessionCopy.player2.id
    )
    assert.isTrue(result)
    assert.equal(player1Id, sessionCopy.player1.id)
    assert.notEqual(player1Id, sessionCopy.player2.id)
  })

  test('should return true when player2 is one of the 2 players in the game session', ({
    assert,
  }) => {
    const result = gameRules.isAuthorizedPlayer(
      player2Id,
      sessionCopy.player1.id,
      sessionCopy.player2.id
    )
    assert.isTrue(result)
    assert.equal(player2Id, sessionCopy.player2.id)
    assert.notEqual(player2Id, sessionCopy.player1.id)
  })

  test('should return false when player3 is not one of the 2 players in the game session', ({
    assert,
  }) => {
    const result = gameRules.isAuthorizedPlayer(
      player3Id,
      sessionCopy.player1.id,
      sessionCopy.player2.id
    )
    assert.isFalse(result)
    assert.notEqual(player3Id, sessionCopy.player1.id)
    assert.notEqual(player3Id, sessionCopy.player2.id)
  })
})
