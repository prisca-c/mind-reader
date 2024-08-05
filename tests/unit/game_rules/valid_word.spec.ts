import { test } from '@japa/runner'
import { GameRules } from '#features/game_session/contracts/game_rules/game_rules'
import type { GameSession } from '#features/game_session/types/game_session'
import { ValidWordState } from '#features/game_session/enums/valid_word_state'
import { player1, player2, session } from '#tests/utils/session_data'

test.group('GameRules - validWord', () => {
  const gameRules = new GameRules()

  test('should return NOT_DEFINED when word is not defined', ({ assert }) => {
    const result = gameRules.validWord(session, player1.id, 'app')
    assert.equal(result.status, ValidWordState.NOT_DEFINED)
  })

  test('should return MATCHES when hint giver matches the word', ({ assert }) => {
    const sessionCopy: GameSession = { ...session, word: 'apple' }
    const result = gameRules.validWord(sessionCopy, player1.id, 'app')
    assert.equal(result.status, ValidWordState.MATCHES)
  })

  test('should return VALID if the player is the guesser and the word matches', ({ assert }) => {
    const sessionCopy: GameSession = { ...session, word: 'apple', hintGiver: player2.id }
    const result = gameRules.validWord(sessionCopy, player1.id, 'app')
    assert.equal(result.status, ValidWordState.VALID)
  })

  test('should return VALID if the player is the hint giver and the word does not match', ({
    assert,
  }) => {
    const sessionCopy: GameSession = { ...session, word: 'apple' }
    const result = gameRules.validWord(sessionCopy, player1.id, 'banana')
    assert.equal(result.status, ValidWordState.VALID)
  })
})
