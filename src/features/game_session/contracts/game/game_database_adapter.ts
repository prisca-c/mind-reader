import { CacheService } from '#services/cache/cache_service'
import { EventStreamService } from '#services/event_stream/event_stream_service'
import type { GameSession } from '#features/game_session/types/game_session'
import { GamePort } from '#features/game_session/contracts/game/game_port'
import { GameState } from '#features/game_session/enums/game_state'
import GameHistory from '#models/game_history'
import { DateTime } from 'luxon'
import Word from '#models/word'
import { inject } from '@adonisjs/core'

@inject()
export class GameDatabaseAdapter implements GamePort {
  constructor(
    private cache: CacheService,
    private eventStream: EventStreamService
  ) {}

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

  async broadcastAnswer(session: GameSession, isOver: boolean, isCorrect: boolean): Promise<void> {
    const sessionId = session.sessionId
    const status = isCorrect ? GameState.WIN : isOver ? GameState.LOSE : GameState.PLAYING
    const turn = isOver ? null : session.turn
    const wordsList = JSON.stringify(session.wordsList)
    this.eventStream.broadcast(`game/session/${sessionId}/user/${session.player1.id}`, {
      status,
      wordsList,
      turn: turn ? turn === session.player1.id : null,
    })
    this.eventStream.broadcast(`game/session/${sessionId}/user/${session.player2.id}`, {
      status,
      wordsList,
      turn: turn ? turn === session.player2.id : null,
    })
  }

  async broadcastError(session: GameSession): Promise<void> {
    const sessionId = session.sessionId
    this.eventStream.broadcast(`game/session/${sessionId}/user/${session.player1.id}`, {
      status: GameState.ERROR,
    })
    this.eventStream.broadcast(`game/session/${sessionId}/user/${session.player2.id}`, {
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
