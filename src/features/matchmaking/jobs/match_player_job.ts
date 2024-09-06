import { DateTime } from 'luxon'
import { CacheService } from '#services/cache/cache_service'
import { EventStreamService } from '#services/event_stream/event_stream_service'
import type { Player } from '#features/game_session/types/player'
import { randomUUID } from 'node:crypto'
import Word from '#models/word'
import logger from '@adonisjs/core/services/logger'
import type {
  GameSession,
  GameSessionId,
  PlayerSession,
} from '#features/game_session/types/game_session'
import { SessionStateEnum } from '#features/game_session/enums/session_state'

export class MatchPlayerJob {
  #players: Player[] = []

  constructor(
    private cache: CacheService,
    private eventStream: EventStreamService
  ) {}

  async handle() {
    logger.info('Matching players')
    this.#players = await this.getPlayersFromCache()

    if (this.#players.length >= 2) {
      const players = this.#players
      const [player1, player2] = this.getRandomPlayers(players)

      if (player1.id === player2.id) return

      this.#players = this.#players.filter(
        (p: Player) => p.id !== player1.id && p.id !== player2.id
      )
      await this.updateCachePlayers()

      const sessionId = randomUUID() as GameSessionId
      this.broadcastGameInvitation(player1, player2, sessionId)

      const session = await this.createSession(player1, player2, sessionId)
      await this.sleep(1000)
      const status = await this.validateSession(sessionId)

      if (!status || !session) return

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
    const playersCache = await this.cache.get('game:queue:players')
    return playersCache ? JSON.parse(playersCache) : []
  }

  getRandomPlayers(players: Player[]) {
    if (players.length < 2) throw new Error('Not enough players')
    const playersCopy = [...players]

    const player1Index = Math.floor(Math.random() * playersCopy.length)
    const player1 = playersCopy[player1Index]
    playersCopy.splice(player1Index, 1)

    const player2Index = Math.floor(Math.random() * playersCopy.length)
    const player2 = playersCopy[player2Index]
    playersCopy.splice(player2Index, 1)

    return [player1, player2]
  }

  broadcastGameInvitation(player1: Player, player2: Player, sessionId: string) {
    logger.info(`Broadcasting game invitation to ${player1.id} and ${player2.id}`)
    this.eventStream.broadcast(`game/user/${player1.id}`, { status: 'accept', sessionId })
    this.eventStream.broadcast(`game/user/${player2.id}`, { status: 'accept', sessionId })
  }

  broadcastGameStart(player1: Player, player2: Player, sessionId: string) {
    logger.info(`Broadcasting game start to ${player1.id} and ${player2.id}`)
    this.eventStream.broadcast(`game/user/${player1.id}`, { status: 'start', sessionId })
    this.eventStream.broadcast(`game/user/${player2.id}`, { status: 'start', sessionId })
  }

  private async sleep(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay))
  }

  async createSession(player1: Player, player2: Player, sessionId: GameSessionId) {
    const sessionPlayer1: PlayerSession = { ...player1, accepted: false, ready: false }
    const sessionPlayer2: PlayerSession = { ...player2, accepted: false, ready: false }

    const initSession: GameSession = {
      sessionId,
      player1: sessionPlayer1,
      player2: sessionPlayer2,
      status: SessionStateEnum.MATCHMAKING,
      turn: null,
      guessed: false,
      hintGiver: null,
      word: null,
      startedAt: null,
      wordsList: { hintGiver: [], guesser: [] },
    }

    await this.cache.set(`game:session:${sessionId}`, JSON.stringify(initSession))

    return initSession
  }

  async validateSession(sessionId: string): Promise<boolean> {
    const session = await this.cache.get(`game:session:${sessionId}`)
    if (!session) return false
    const status = await this.checkPlayerStatus(sessionId)
    return status
  }

  async checkPlayerStatus(sessionId: string) {
    logger.info('Checking player status')
    const session = await this.cache.get(`game:session:${sessionId}`)
    if (!session) return false
    const { player1, player2 } = JSON.parse(session) as GameSession

    if (!player1.accepted || !player2.accepted) {
      logger.info('One of the players did not accept the game')

      if (!player1.accepted) {
        logger.info('Player 1 not accepted')
        this.eventStream.broadcast(`game/user/${player1.id}`, { status: 'removed' })
      } else if (player1.accepted) {
        logger.info('Player 1 accepted')
        this.#players.push(player1)
      }

      if (!player2.accepted) {
        logger.info('Player 2 not accepted')
        this.eventStream.broadcast(`game/user/${player2.id}`, { status: 'removed' })
      } else if (player2.accepted) {
        logger.info('Player 2 accepted')
        this.#players.push(player2)
      }

      logger.info('Removing session:', sessionId)
      await this.cache.del(`game:session:${sessionId}`)

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

    const currentSession = await this.cache.get(`game:session:${sessionId}`)
    if (!currentSession) return

    const updatedSession: GameSession = {
      ...JSON.parse(currentSession),
      hintGiver: hintGiverId,
      status: SessionStateEnum.READY,
      word: word.name,
      turn: hintGiverId,
      startedAt: DateTime.now().toISO(),
    }

    await this.cache.set(`game:session:${sessionId}`, JSON.stringify(updatedSession))

    this.broadcastGameStart(player1, player2, sessionId)

    this.#players = players.filter((p) => p.id !== player1.id && p.id !== player2.id)

    await this.updateCachePlayers()
  }

  async updateCachePlayers() {
    const players = this.#players
    await Promise.all([
      this.cache.set('game:queue:players', JSON.stringify(players)),
      this.cache.set('game:queue:count', players.length.toString()),
    ])
    this.eventStream.broadcast('game/search', { queueCount: players.length })
  }
}
