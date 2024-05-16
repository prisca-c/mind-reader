import { DateTime } from 'luxon'
import redis from '@adonisjs/redis/services/main'
import transmit from '@adonisjs/transmit/services/main'
import type { Player } from '#types/player'
import { randomUUID } from 'node:crypto'
import Word from '#models/word'

export class MatchPlayerService {
  async handle() {
    const playersCache = await redis.get('game:queue:players')
    const players = playersCache ? JSON.parse(playersCache) : []

    if (players.length < 2) {
      return
    }

    while (players.length > 2) {
      const player1 = players[Math.floor(Math.random() * players.length)]
      const player2 = players[Math.floor(Math.random() * players.length)]

      if (player1.id === player2.id) {
        continue
      }

      const sessionId = randomUUID()

      transmit.broadcast(`game/user/${player1.id}`, { message: 'Accept game', sessionId })
      transmit.broadcast(`game/user/${player2.id}`, { message: 'Accept game', sessionId })

      const sessionPlayer1: Player & { accepted: boolean } = {
        id: player1.id,
        username: player1.username,
        elo: player1.elo,
        accepted: false,
      }
      const sessionPlayer2: Player & { accepted: boolean } = {
        id: player2.id,
        username: player2.username,
        elo: player2.elo,
        accepted: false,
      }

      await redis.set(
        `game:session:${sessionId}`,
        JSON.stringify({ player1: sessionPlayer1, player2: sessionPlayer2 })
      )

      await new Promise((resolve) => setTimeout(resolve, 10000))

      const session = await redis.get(`game:sessions:${sessionId}`)

      if (!session) continue

      const { player1: player1Session, player2: player2Session } = JSON.parse(session)

      if (!player1Session.accepted || !player2Session.accepted) {
        if (!player1Session.accepted) {
          await this.#removePlayerFromQueue(player1, players)
        }

        if (!player2Session.accepted) {
          await this.#removePlayerFromQueue(player2, players)
        }

        await redis.del(`game:session:${sessionId}`)
        continue
      }

      const word = await Word.query().orderByRaw('RANDOM()').first()

      if (!word) continue

      const currentSession = await redis.get(`game:session:${sessionId}`)

      if (!currentSession) continue

      const updatedSession = {
        ...JSON.parse(currentSession),
        word: word.name,
        startedAt: DateTime.now().toISO(),
      }

      await redis.set(`game:session:${sessionId}`, JSON.stringify(updatedSession))

      const gameDataGuesser = {
        sessionId,
      }

      const gameDataHintGiver = {
        sessionId,
        word: word.name,
      }

      const hintGiverId = Math.random() > 0.5 ? player1.id : player2.id
      const guesserId = hintGiverId === player1.id ? player2.id : player1.id

      transmit.broadcast(`game/session/${sessionId}/user/${guesserId}`, gameDataGuesser)
      transmit.broadcast(`game/session/${sessionId}/user/${hintGiverId}`, gameDataHintGiver)

      players.forEach((p: Player) => {
        if (p.id === player1.id || p.id === player2.id) {
          players.splice(players.indexOf(p), 1)
        }
      })

      await this.#updateCachePlayers(players)
    }
  }

  async #updateCachePlayers(players: Player[]) {
    await Promise.all([
      redis.set('game:queue:players', JSON.stringify(players)),
      redis.set('game:queue:count', players.length),
    ])
  }

  async #removePlayerFromQueue(player: Player, players: Player[]) {
    players.forEach((p: Player) => {
      if (p.id === player.id) {
        players.splice(players.indexOf(p), 1)
      }
    })

    await this.#updateCachePlayers(players)
  }
}
