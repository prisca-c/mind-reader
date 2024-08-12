import { Cache } from '#services/cache/cache'
import transmit from '@adonisjs/transmit/services/main'
import type { GameSession } from '#features/game_session/types/game_session'
import { GamePort } from '#features/game_session/contracts/game/game_port'
import { GameState } from '#features/game_session/enums/game_state'
import GameHistory from '#models/game_history'
import { DateTime } from 'luxon'
import Word from '#models/word'
import { inject } from '@adonisjs/core'

@inject()
export class GameDatabaseAdapter implements GamePort {
  constructor(private cache: Cache) {}

  async getSession(sessionId: string): Promise<GameSession | null> {
    const session = await this.cache.get(`game:session:${sessionId}`)
    if (!session) {
      return null
    }
    return JSON.parse(session) as GameSession
  }

  async updateSession(session: GameSession): Promise<void> {
    const sessionId = session.sessionId
    await this.cache.set(`game:session:${sessionId}`, JSON.stringify(session))
  }

  async broadcastAnswer(session: GameSession, isCorrect: boolean): Promise<void> {
    const sessionId = session.sessionId
    const status = isCorrect ? GameState.WIN : GameState.LOSE
    const turn = isCorrect ? null : session.turn
    const wordsList = JSON.stringify(session.wordsList)
    transmit.broadcast(`game/session/${sessionId}/user/${session.player1.id}`, {
      status,
      wordsList,
      turn: turn ? turn === session.player1.id : null,
    })
    transmit.broadcast(`game/session/${sessionId}/user/${session.player2.id}`, {
      status,
      wordsList,
      turn: turn ? turn === session.player2.id : null,
    })
  }

  async broadcastError(session: GameSession): Promise<void> {
    const sessionId = session.sessionId
    transmit.broadcast(`game/session/${sessionId}/user/${session.player1.id}`, {
      status: GameState.ERROR,
    })
    transmit.broadcast(`game/session/${sessionId}/user/${session.player2.id}`, {
      status: GameState.ERROR,
    })
  }

  async saveToGameHistory(session: GameSession): Promise<void> {
    const word = await Word.findByOrFail('name', session.word)
    const guesserId =
      session.hintGiver === session.player1.id ? session.player2.id : session.player1.id
    await GameHistory.create({
      sessionId: session.sessionId,
      date: DateTime.fromISO(session.startedAt!),
      hintGiverId: session.hintGiver!,
      guesserId,
      wordsList: session.wordsList,
      wordId: word.id,
      guessed: session.guessed,
    })

    await this.cache.del(`game:session:${session.sessionId}`)
  }
}
