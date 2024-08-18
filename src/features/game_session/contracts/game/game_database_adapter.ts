import { CacheService } from '#services/cache/cache_service'
import { EventStreamService } from '#services/event_stream/event_stream_service'
import type { GameSession } from '#features/game_session/types/game_session'
import { GamePort } from '#features/game_session/contracts/game/game_port'
import { GameState } from '#features/game_session/enums/game_state'
import GameHistory from '#models/game_history'
import { DateTime } from 'luxon'
import Word from '#models/word'
import { inject } from '@adonisjs/core'
import User from '#models/user'

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
      word: isOver ? session.word : null,
      wordsList,
      turn: turn ? turn === session.player1.id : null,
    })
    this.eventStream.broadcast(`game/session/${sessionId}/user/${session.player2.id}`, {
      status,
      word: isOver ? session.word : null,
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

    // Handle the word's played count and found count
    word.playedCount = word.playedCount + 1
    if (session.guessed) {
      // Increment the found count of the word
      word.foundCount = word.foundCount + 1
    }
    await word.save()

    // handle player's elo
    const hintGiver = await User.findOrFail(session.hintGiver)
    const guesser = await User.findOrFail(guesserId)
    const elo = this.calculateElo(hintGiver.elo, guesser.elo, session.guessed, word.difficulty)
    hintGiver.elo = elo.hintGiverNewElo
    guesser.elo = elo.guesserNewElo
    await hintGiver.save()
    await guesser.save()

    await this.cache.del(`game:session:${session.sessionId}`)
  }

  private calculateElo(
    hintGiverElo: number,
    guesserElo: number,
    guessed: boolean,
    wordDifficulty: number = 1
  ): { hintGiverNewElo: number; guesserNewElo: number } {
    const K = wordDifficulty * 32 // K-factor which is used to adjust the weight of the elo change
    const hintGiverExpected = 1 / (1 + 10 ** ((guesserElo - hintGiverElo) / 400))
    const guesserExpected = 1 / (1 + 10 ** ((hintGiverElo - guesserElo) / 400))

    const hintGiverNewElo = Math.round(
      hintGiverElo + K * (guessed ? 1 - hintGiverExpected : 0 - hintGiverExpected)
    )
    const guesserNewElo = Math.round(
      guesserElo + K * (guessed ? 1 - guesserExpected : 0 - guesserExpected)
    )

    return { hintGiverNewElo, guesserNewElo }
  }
}
