import { test } from '@japa/runner'
import { GameRules } from '#features/game_session/contracts/game_rules/game_rules'
import { player1, player2, session } from '#tests/utils/session_data'

test.group('GameRules - validateAnswer', () => {
  const gameRules = new GameRules()

  test('should return false when word is not defined', ({ assert }) => {
    const sessionCopy = { ...session, word: null }
    const result = gameRules.validateAnswer(sessionCopy, 'app', player1.id)
    assert.isFalse(result)
  })

  test('should return true when the player is the guesser and the word matches', ({ assert }) => {
    const sessionCopy = { ...session, word: 'apple', hintGiver: player2.id }
    const result = gameRules.validateAnswer(sessionCopy, 'apple', player1.id)
    assert.isTrue(result)
  })

  test('should return false when the player is the guesser and the word does not match', ({
    assert,
  }) => {
    const sessionCopy = { ...session, word: 'apple', hintGiver: player2.id }
    const result = gameRules.validateAnswer(sessionCopy, 'banana', player1.id)
    assert.isFalse(result)
  })

  test('should return false when the player is the hint giver', ({ assert }) => {
    const sessionCopy = { ...session, word: 'apple' }
    const result = gameRules.validateAnswer(sessionCopy, 'apple', player1.id)
    assert.isFalse(result)
  })
})
