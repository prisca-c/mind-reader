import { DateTime } from 'luxon'
import redis from '@adonisjs/redis/services/main'
import transmit from '@adonisjs/transmit/services/main'
import type { Player } from '#types/player'
import { randomUUID } from 'node:crypto'
import Word from '#models/word'
import logger from '@adonisjs/core/services/logger'

export class MatchPlayerService {
  async handle() {
    logger.info('Matching players')
    const players = await this.getPlayersFromCache()

    while (players.length > 2) {
      const [player1, player2] = this.getRandomPlayers(players)

      if (player1.id === player2.id) continue

      const sessionId = randomUUID()
      this.broadcastGameInvitation(player1, player2, sessionId)

      const session = await this.createSession(player1, player2, sessionId)

      if (!session) continue

      const word = await Word.query().orderByRaw('RANDOM()').first()
      if (!word) continue

      await this.startGameSession(sessionId, word, players, player1, player2)
    }
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

  async createSession(player1: Player, player2: Player, sessionId: string) {
    const sessionPlayer1 = { ...player1, accepted: false }
    const sessionPlayer2 = { ...player2, accepted: false }

    await redis.set(
      `game:session:${sessionId}`,
      JSON.stringify({ player1: sessionPlayer1, player2: sessionPlayer2 })
    )

    await new Promise((resolve) => setTimeout(resolve, 10000))

    const session = await redis.get(`game:session:${sessionId}`)

    if (!session) {
      await this.removeUnacceptedPlayersFromCache(sessionId, sessionPlayer1, sessionPlayer2)
    }

    return session ? JSON.parse(session) : null
  }

  async removeUnacceptedPlayersFromCache(
    sessionId: string,
    player1: Player & { accepted: boolean },
    player2: Player & { accepted: boolean }
  ) {
    await redis.del(`game:session:${sessionId}`)

    if (!player1.accepted || !player2.accepted) {
      const players = await this.getPlayersFromCache()
      if (!player1.accepted) {
        players.filter((p: Player) => p.id !== player1.id)
      }

      if (!player2.accepted) {
        players.filter((p: Player) => p.id !== player2.id)
      }

      await this.updateCachePlayers(players)
    }
  }

  async startGameSession(
    sessionId: string,
    word: Word,
    players: Player[],
    player1: Player,
    player2: Player
  ) {
    const updatedSession = {
      word: word.name,
      startedAt: DateTime.now().toISO(),
    }

    await redis.set(`game:session:${sessionId}`, JSON.stringify(updatedSession))

    const gameDataGuesser = { sessionId }
    const gameDataHintGiver = { sessionId, word: word.name }

    const hintGiverId = Math.random() > 0.5 ? player1.id : player2.id
    const guesserId = hintGiverId === player1.id ? player2.id : player1.id

    transmit.broadcast(`game/session/${sessionId}/user/${guesserId}`, gameDataGuesser)
    transmit.broadcast(`game/session/${sessionId}/user/${hintGiverId}`, gameDataHintGiver)

    players = players.filter((p) => p.id !== player1.id && p.id !== player2.id)

    await this.updateCachePlayers(players)
  }

  async updateCachePlayers(players: Player[]) {
    await Promise.all([
      redis.set('game:queue:players', JSON.stringify(players)),
      redis.set('game:queue:count', players.length),
    ])
  }
}
