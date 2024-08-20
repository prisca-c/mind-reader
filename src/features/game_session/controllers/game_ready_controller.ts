import type { HttpContext } from '@adonisjs/core/http'
import type { GameSession, GameSessionId } from '#features/game_session/types/game_session'
import { CacheService } from '#services/cache/cache_service'
import { inject } from '@adonisjs/core'
import { assert } from '#helpers/assert'
import { EventStreamService } from '#services/event_stream/event_stream_service'
import { SessionStateEnum } from '#features/game_session/enums/session_state'
import { GameState } from '#features/game_session/enums/game_state'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'
import { GamePort } from '#features/game_session/contracts/game/game_port'

export default class GameReadyController {
  @inject()
  async handle(
    ctx: HttpContext,
    cache: CacheService,
    eventStream: EventStreamService,
    gamePort: GamePort
  ) {
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
    const test = {
      channel:
        'game/session/88b08f38-93fe-4718-a7e2-8b7095c909b2/user/775b07e7-da2d-4c1f-a19c-c16a28849835',
      payload: {
        status: 'lose',
        word: 'banane',
        wordList: '{"hintGiver":[],"guesser":[]}',
        turn: null,
      },
    }

    if (
      parsedSession.status === SessionStateEnum.READY &&
      (parsedSession.player1.ready || parsedSession.player2.ready)
    ) {
      parsedSession.status = SessionStateEnum.PLAYING
      parsedSession.startedAt = DateTime.local().toISO()
      await cache.set(`game:session:${sessionId}`, JSON.stringify(parsedSession))
      eventStream.broadcast(`game/session/${sessionId}/user/${parsedSession.player1.id}`, {
        sessionState: SessionStateEnum.PLAYING,
      })
      eventStream.broadcast(`game/session/${sessionId}/user/${parsedSession.player2.id}`, {
        sessionState: SessionStateEnum.PLAYING,
      })
      logger.info('Start Game', '- Session: ' + sessionId)
      setTimeout(async () => {
        const updatedSession = await cache.get('game:session:' + sessionId)
        if (!updatedSession) return

        const parsedUpdatedSession: GameSession = JSON.parse(updatedSession)
        if (parsedUpdatedSession.turn === null) return

        logger.info('End Game', '- Session: ' + sessionId)
        eventStream.broadcast(`game/session/${sessionId}/user/${parsedUpdatedSession.player1.id}`, {
          status: GameState.LOSE,
          word: parsedUpdatedSession.word,
          wordsList: JSON.stringify(parsedUpdatedSession.wordsList),
          turn: null,
        })
        eventStream.broadcast(`game/session/${sessionId}/user/${parsedUpdatedSession.player2.id}`, {
          status: GameState.LOSE,
          word: parsedUpdatedSession.word,
          wordsList: JSON.stringify(parsedUpdatedSession.wordsList),
          turn: null,
        })

        await gamePort.saveToGameHistory(parsedUpdatedSession)
      }, 110000)
    }
  }
}
