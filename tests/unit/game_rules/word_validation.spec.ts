import { test } from '@japa/runner'
import { GameRules } from '#features/game_session/contracts/game_rules/game_rules'
import type { GameSession, GameSessionId } from '#features/game_session/types/game_session'
import type { UserId } from '#models/user'
import type { Player } from '#features/game_session/types/player'
import { DateTime } from 'luxon'
import { ValidWordState } from '#features/game_session/enums/valid_word_state'

test.group('Game Rules - Word Validation', () => {
  const player1: Player & { accepted: boolean } = {
    id: '1' as UserId,
    username: 'player1',
    elo: 1000,
    accepted: true,
  }

  const player2: Player & { accepted: boolean } = {
    id: '2' as UserId,
    username: 'player2',
    elo: 1000,
    accepted: true,
  }

  const gameRules = new GameRules()

  const session: GameSession = {
    sessionId: '1' as GameSessionId,
    player1: player1,
    player2: player2,
    hintGiver: player1.id as UserId,
    turn: player1.id as UserId,
    word: null,
    guessed: false,
    startedAt: DateTime.now().toISO(),
    wordsList: {
      hintGiver: [],
      guesser: [],
    },
  }

  test('should return NOT_DEFINED when word is not defined', async ({ assert }) => {
    const result = gameRules.validWord(session, player1.id, 'apple')
    assert.equal(result.status, ValidWordState.NOT_DEFINED)
  })

  test('should return MATCHES when hint giver matches the word', async ({ assert }) => {
    session.word = 'apple'
    const result = gameRules.validWord(session, player1.id, 'app')
    assert.equal(result.status, ValidWordState.MATCHES)
  })

  test('should return VALID if the word is valid', async ({ assert }) => {
    session.word = 'apple'
    const result = gameRules.validWord(session, player1.id, 'banana')
    assert.equal(result.status, ValidWordState.VALID)
  })
})
