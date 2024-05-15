import type { HttpContext } from '@adonisjs/core/http'
import transmit from '@adonisjs/transmit/services/main'
import redis from '@adonisjs/redis/services/main'
import Word from '#models/word'
import { randomUUID } from 'node:crypto'
import logger from '@adonisjs/core/services/logger'
import type { UserId } from '#models/user'
import { DateTime } from 'luxon'

type Player = {
  id: UserId
  username: string
  elo: number
  date: DateTime
}

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
    const player = { id: user.id, username: user.username, elo: user.elo, date: DateTime.now() }

    const playerExists = players.find((p: Player) => p.id === user.id)

    if (!playerExists) {
      players.push(player)
      await redis.set('game:queue:players', JSON.stringify(players))
    }

    if (playerExists) {
      players.forEach((p: Player) => {
        if (p.id === user.id) {
          p.date = DateTime.now()
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

  async matchPlayers() {
    const players = await redis.get('game:queue:players')

    if (!players) {
      return
    }

    const playerList = players.split(',')

    if (playerList.length < 2) {
      return
    }

    const word = await Word.query().orderByRaw('RANDOM()').first()

    if (!word) {
      return
    }

    const sessionId = randomUUID()

    const player1 = playerList[Math.floor(Math.random() * playerList.length)]
    playerList.splice(playerList.indexOf(player1), 1)
    const player2 = playerList[Math.floor(Math.random() * playerList.length)]
    playerList.splice(playerList.indexOf(player2), 1)

    await redis.set('game:queue:players', playerList.join(','))
    await redis.set('game:queue:count', playerList.length)

    const guesser = JSON.parse(Math.random() < 0.5 ? player1 : player2)
    const hintGiver = JSON.parse(guesser === player1 ? player2 : player1)

    const guesserPayload = {
      session: sessionId,
      isGuesser: true,
      opponent: hintGiver,
    }

    const hintGiverPayload = {
      session: sessionId,
      isGuesser: false,
      opponent: guesser,
      word: word.name,
    }

    transmit.broadcast('game/user/' + guesser.id, guesserPayload)

    transmit.broadcast('game/user/' + hintGiver.id, hintGiverPayload)

    const gameStatusEnum = {
      waiting: 'waiting',
      active: 'active',
      finished: 'finished',
    } as const

    await redis.set(
      `game:session:${sessionId}`,
      JSON.stringify({
        guesser,
        hintGiver,
        word,
        status: 'active',
        startedAt: new Date(),
      })
    )

    return
  }

  async guess({ auth, request, response, params }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized()
    }

    const user = auth.user
    const { guess } = request.all()
    const sessionId = params.sessionId

    if (!guess) {
      return response.badRequest('Guess is required')
    }

    const session = await redis.get(`game:session:${sessionId}`)

    if (!session) {
      return response.badRequest('No active game session')
    }

    const { guesser, hintGiver, word } = JSON.parse(session)

    if (user.id !== guesser.id) {
      return response.badRequest('You are not the guesser')
    }

    const guessed = guess.toLowerCase() === word.name.toLowerCase()

    await redis.del(`game:session:${guesser.id}:${hintGiver.id}`)
    await redis.del(`game:session:${hintGiver.id}:${guesser.id}`)

    transmit.broadcast('game/guess/' + guesser.id, {
      guess,
      guessed,
    })
  }
}
