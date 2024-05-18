import { DateTime } from 'luxon'
import redis from '@adonisjs/redis/services/main'
import transmit from '@adonisjs/transmit/services/main'
import type { Player } from '#types/player'
import { randomUUID } from 'node:crypto'
import Word from '#models/word'
import logger from '@adonisjs/core/services/logger'
import type { GameSession, GameSessionId } from '#types/game_session'

export class MatchPlayerService {
  #players: Player[] = []

  async handle() {
    logger.info('Matching players')
    this.#players = await this.getPlayersFromCache()

    while (this.#players.length >= 2) {
      const players = this.#players
      const [player1, player2] = this.getRandomPlayers(players)

      if (player1.id === player2.id) continue

      const sessionId = randomUUID() as GameSessionId
      this.broadcastGameInvitation(player1, player2, sessionId)

      const session = await this.createSession(player1, player2, sessionId)

      if (!session) continue

      const word = await Word.query().orderByRaw('RANDOM()').first()
      if (!word) {
        logger.error('No word found')
        return
      }

      await this.startGameSession(sessionId, word, players, player1, player2)
    }
    logger.info('End of matching players')
  }

  async getPlayersFromCache() {
    const playersCache = await redis.get('game:queue:players')
    return playersCache ? JSON.parse(playersCache) : []
  }

  getRandomPlayers(players: Player[]) {
    return [
      players[Math.floor(Math.random() * players.length)],
      players[Math.floor(Math.random() * players.length)],
    ]
  }

  broadcastGameInvitation(player1: Player, player2: Player, sessionId: string) {
    logger.info(`Broadcasting game invitation to ${player1.id} and ${player2.id}`)
    transmit.broadcast(`game/user/${player1.id}`, { status: 'accept', sessionId })
    transmit.broadcast(`game/user/${player2.id}`, { status: 'accept', sessionId })
  }

  broadcastGameStart(player1: Player, player2: Player, sessionId: string) {
    logger.info(`Broadcasting game start to ${player1.id} and ${player2.id}`)
    transmit.broadcast(`game/user/${player1.id}`, { status: 'start', sessionId })
    transmit.broadcast(`game/user/${player2.id}`, { status: 'start', sessionId })
  }

  async createSession(player1: Player, player2: Player, sessionId: GameSessionId) {
    const sessionPlayer1 = { ...player1, accepted: false }
    const sessionPlayer2 = { ...player2, accepted: false }

    const initSession: GameSession = {
      sessionId,
      player1: sessionPlayer1,
      player2: sessionPlayer2,
      turn: null,
      guessed: false,
      hintGiver: null,
      word: null,
      startedAt: null,
      wordsList: { hintGiver: [], guesser: [] },
    }

    await redis.set(`game:session:${sessionId}`, JSON.stringify(initSession))

    await new Promise((resolve) => setTimeout(resolve, 10000))

    const session = await redis.get(`game:session:${sessionId}`)

    const status = await this.checkPlayerStatus(sessionId)

    if (!status || !session) return null

    return JSON.parse(session)
  }

  async checkPlayerStatus(sessionId: string) {
    logger.info('Checking player status')
    const session = await redis.get(`game:session:${sessionId}`)
    if (!session) return
    const { player1, player2 } = JSON.parse(session) as GameSession

    if (!player1.accepted || !player2.accepted) {
      logger.info('One of the players did not accept the game')
      if (!player1.accepted) {
        logger.info('Player 1 not accepted')
        this.#players = this.#players.filter((p: Player) => p.id !== player1.id)
        transmit.broadcast(`game/user/${player1.id}`, { status: 'removed' })
      }

      if (!player2.accepted) {
        logger.info('Player 2 not accepted')
        this.#players = this.#players.filter((p: Player) => p.id !== player2.id)
        transmit.broadcast(`game/user/${player2.id}`, { status: 'removed' })
      }

      logger.info('Removing session:', sessionId)
      await redis.del(`game:session:${sessionId}`)

      await this.updateCachePlayers()
      return false
    }

    return true
  }

  async startGameSession(
    sessionId: string,
    word: Word,
    players: Player[],
    player1: Player,
    player2: Player
  ) {
    logger.info(`Starting game session ${sessionId}`)

    const hintGiverId = Math.random() > 0.5 ? player1.id : player2.id
    const guesserId = hintGiverId === player1.id ? player2.id : player1.id

    const currentSession = await redis.get(`game:session:${sessionId}`)
    if (!currentSession) return

    const updatedSession: GameSession = {
      ...JSON.parse(currentSession),
      hintGiver: hintGiverId,
      word: word.name,
      turn: hintGiverId,
      startedAt: DateTime.now().toISO(),
    }

    await redis.set(`game:session:${sessionId}`, JSON.stringify(updatedSession))

    const gameDataGuesser = { sessionId, turn: false }
    const gameDataHintGiver = { sessionId, word: word.name, turn: true }

    this.broadcastGameStart(player1, player2, sessionId)
    new Promise((resolve) => setTimeout(resolve, 5000))

    transmit.broadcast(`game/session/${sessionId}/user/${guesserId}`, gameDataGuesser)
    transmit.broadcast(`game/session/${sessionId}/user/${hintGiverId}`, gameDataHintGiver)

    this.#players = players.filter((p) => p.id !== player1.id && p.id !== player2.id)

    await this.updateCachePlayers()
  }

  async updateCachePlayers() {
    const players = this.#players
    await Promise.all([
      redis.set('game:queue:players', JSON.stringify(players)),
      redis.set('game:queue:count', players.length),
    ])
    transmit.broadcast('game/search', { queueCount: players.length })
  }
}
