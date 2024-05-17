import type { HttpContext } from '@adonisjs/core/http'
import transmit from '@adonisjs/transmit/services/main'
import redis from '@adonisjs/redis/services/main'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'
import type { Player } from '#types/player'
import { GameSession } from '#types/game_session'

export default class GameController {
  async searchingQueue({ auth, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized()
    }

    const user = auth.user

    const playersL = await redis.get('game:queue:players')
    logger.info(playersL)

    const playersCache = await redis.get('game:queue:players')
    const players = playersCache ? JSON.parse(playersCache) : []
    const player = {
      id: user.id,
      username: user.username,
      elo: user.elo,
      date: DateTime.now().toISO(),
    }

    const playerExists = players.find((p: Player & { date: string }) => p.id === user.id)

    if (!playerExists) {
      players.push(player)
      await redis.set('game:queue:players', JSON.stringify(players))
    }

    if (playerExists) {
      players.forEach((p: Player & { date: string }) => {
        if (p.id === user.id) {
          p.date = DateTime.now().toISO()
        }
      })
    }

    const queueCount = players.length
    await redis.set('game:queue:count', queueCount)

    transmit.broadcast('game/search', {
      queueCount: queueCount,
    })

    return response.ok({
      message: 'Added to queue',
      queueCount,
    })
  }

  async handleAccept({ auth, response, params }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized()
    }

    const sessionId = params.sessionId
    const session = await redis.get(`game:session:${sessionId}`)
    const user = auth.user
    if (!session) {
      return response.notFound()
    }

    const { player1, player2 } = JSON.parse(session) as GameSession

    if (player1.id === user.id) {
      player1.accepted = true
    }

    if (player2.id === user.id) {
      player2.accepted = true
    }

    const updatedSession: GameSession = {
      ...JSON.parse(session),
      player1,
      player2,
    }

    await redis.set(`game:session:${sessionId}`, JSON.stringify(updatedSession))

    return response.ok({
      message: 'Accepted',
    })
  }
}
