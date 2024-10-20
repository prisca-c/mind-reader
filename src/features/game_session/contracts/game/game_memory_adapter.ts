import { DateTime } from 'luxon'
import { GamePort } from '#features/game_session/contracts/game/game_port'
import { GameState } from '#features/game_session/enums/game_state'
import type { GameSession } from '#features/game_session/types/game_session'
import GameHistory from '#models/game_history'
import Word from '#models/word'
import { EventStreamService } from '#services/event_stream/event_stream_service'

const sessions: Map<string, GameSession> = new Map()

export class GameMemoryAdapter implements GamePort {
  public constructor(private eventStream: EventStreamService) {}

  public async getSession(sessionId: string): Promise<GameSession | null> {
    return sessions.get(sessionId) ?? null
  }

  public async updateSession(session: GameSession): Promise<void> {
    sessions.set(session.sessionId, session)
  }

  public async broadcastAnswer(session: GameSession, isCorrect: boolean): Promise<void> {
    const status = isCorrect ? GameState.WIN : GameState.LOSE
    const turn = isCorrect ? null : session.turn
    const wordsList = JSON.stringify(session.wordsList)
    this.eventStream.broadcast(`game/session/${session.sessionId}/user/${session.player1.id}`, {
      status,
      wordsList,
      turn: turn ? turn === session.player1.id : null,
    })
    this.eventStream.broadcast(`game/session/${session.sessionId}/user/${session.player2.id}`, {
      status,
      wordsList,
      turn: turn ? turn === session.player2.id : null,
    })
  }

  public async broadcastError(session: GameSession): Promise<void> {
    this.eventStream.broadcast(`game/session/${session.sessionId}/user/${session.player1.id}`, {
      status: GameState.ERROR,
    })
    this.eventStream.broadcast(`game/session/${session.sessionId}/user/${session.player2.id}`, {
      status: GameState.ERROR,
    })
  }

  public async saveToGameHistory(session: GameSession): Promise<void> {
    const word = await Word.findByOrFail('name', session.word)
    const guesserId = session.hintGiver === session.player1.id ? session.player2.id : session.player1.id
    await GameHistory.create({
      sessionId: session.sessionId,
      date: DateTime.fromISO(session.startedAt!),
      hintGiverId: session.hintGiver!,
      guesserId,
      wordsList: session.wordsList,
      wordId: word.id,
    })
  }
}
