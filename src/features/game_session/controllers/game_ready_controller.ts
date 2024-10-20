import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'
import { GamePort } from '#features/game_session/contracts/game/game_port'
import { SessionStateEnum } from '#features/game_session/enums/session_state'
import type { GameSession, GameSessionId } from '#features/game_session/types/game_session'
import { assert } from '#helpers/assert'
import { CacheService } from '#services/cache/cache_service'
import { EventStreamService } from '#services/event_stream/event_stream_service'
import env from '#start/env'

export default class GameReadyController {
  @inject()
  public async handle(ctx: HttpContext, cache: CacheService, eventStream: EventStreamService, gamePort: GamePort) {
    const { auth, params, response } = ctx

    if (!(await auth.check())) {
      return response.unauthorized()
    }

    const user = auth.user
    assert(user)
    const sessionId: GameSessionId = params.sessionId
    const session = await cache.get('game:session:' + sessionId)

    if (!session) {
      return response.notFound()
    }

    const parsedSession: GameSession = JSON.parse(session)

    if (parsedSession.player1.id === user.id) {
      parsedSession.player1.ready = true
    }

    if (parsedSession.player2.id === user.id) {
      parsedSession.player2.ready = true
    }

    if (
      parsedSession.status === SessionStateEnum.READY &&
      (parsedSession.player1.ready || parsedSession.player2.ready)
    ) {
      parsedSession.status = SessionStateEnum.PLAYING
      parsedSession.startedAt = DateTime.local().toISO()
      await cache.set(`game:session:${sessionId}`, JSON.stringify(parsedSession))
      await new Promise((resolve) => setTimeout(resolve, 3000))
      eventStream.broadcast(`game/session/${sessionId}/user/${parsedSession.player1.id}`, {
        sessionState: SessionStateEnum.PLAYING,
      })
      eventStream.broadcast(`game/session/${sessionId}/user/${parsedSession.player2.id}`, {
        sessionState: SessionStateEnum.PLAYING,
      })
      logger.info('Start Game', '- Session: ' + sessionId)
      setTimeout(async () => {
        const updatedSession = await cache.get('game:session:' + sessionId)
        if (!updatedSession) {
          return response.notFound({
            message: 'Session not found',
          })
        }

        const parsedUpdatedSession: GameSession = JSON.parse(updatedSession)
        if (parsedUpdatedSession.turn === null) {
          return response.notFound({
            message: 'Session not found',
          })
        }

        logger.info('End Game', '- Session: ' + sessionId)

        await gamePort.broadcastAnswer(parsedUpdatedSession, true, false)

        await gamePort.saveToGameHistory(parsedUpdatedSession)
      }, env.get('GAME_LENGTH') * 1000)
    }

    return response.ok({
      message: 'Ready',
    })
  }
}
