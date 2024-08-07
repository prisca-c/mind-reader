import { test } from '@japa/runner'
import { GameRules } from '#features/game_session/contracts/game_rules/game_rules'
import { player1, player2, session } from '#tests/utils/session_data'

test.group('GameRules - updateSessionForHintGiver & updateSessionForGuesser', () => {
  const gameRules = new GameRules()
  const sessionCopy = { ...session, hintGiver: player1.id }

  test('should update session after hint giver gives a word', ({ assert }) => {
    const result = gameRules.updateSessionForHintGiver(sessionCopy, 'apple')
    Object.assign(sessionCopy, result)
    assert.equal(sessionCopy.turn, player2.id)
    assert.deepEqual(sessionCopy.wordsList.hintGiver, ['apple'])
    assert.deepEqual(sessionCopy.wordsList.guesser, [])
  })

  test('should update session after guesser guesses a word which does not match', ({ assert }) => {
    const result = gameRules.updateSessionForGuesser(sessionCopy, 'fruit', false)
    Object.assign(sessionCopy, result)
    assert.equal(sessionCopy.turn, player1.id)
    assert.equal(sessionCopy.guessed, false)
    assert.deepEqual(sessionCopy.wordsList.hintGiver, ['apple'])
    assert.deepEqual(sessionCopy.wordsList.guesser, ['fruit'])
  })

  test('should update session after guesser guesses a word and it matches', ({ assert }) => {
    const result = gameRules.updateSessionForGuesser(sessionCopy, 'apple', true)
    Object.assign(sessionCopy, result)
    assert.equal(sessionCopy.turn, null)
    assert.equal(sessionCopy.guessed, true)
    assert.deepEqual(sessionCopy.wordsList.hintGiver, ['apple'])
    assert.deepEqual(sessionCopy.wordsList.guesser, ['fruit', 'apple'])
  })
})
