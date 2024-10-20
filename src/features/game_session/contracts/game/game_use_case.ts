import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { GamePort } from '#features/game_session/contracts/game/game_port'
import { GameRules } from '#features/game_session/contracts/game_rules/game_rules'
import { ValidWordStateEnum } from '#features/game_session/enums/valid_word_state'
import type { GameSession, GameSessionId } from '#features/game_session/types/game_session'
import { answerValidator } from '#features/game_session/validations/answer'

@inject()
export class GameUseCase {
  private gamePort: GamePort
  private gameRules: GameRules

  public constructor(gamePort: GamePort, gameRules: GameRules) {
    this.gamePort = gamePort
    this.gameRules = gameRules
  }

  public async handle(ctx: HttpContext): Promise<void> {
    const { auth, request, response, params } = ctx
    if (!auth.user) {
      return response.unauthorized()
    }

    await ctx.request.validateUsing(answerValidator)

    const user = auth.user
    const sessionId: GameSessionId = params.sessionId
    const session = await this.gamePort.getSession(sessionId)
    const answer: string = request.input('answer')

    if (!session) {
      return response.notFound()
    }

    /**
     * Check if the user is part of the game session
     */
    if (!this.gameRules.isAuthorizedPlayer(user.id, session.player1.id, session.player2.id)) {
      return response.unauthorized()
    }

    /**
     * ------------------------------
     * Word's validation section
     * ------------------------------
     */
    const validWordCheck = this.gameRules.validWord(session, user.id, answer)

    if (validWordCheck.status === ValidWordStateEnum.NOT_DEFINED) {
      await this.gamePort.broadcastError(session)
      return response.ok({
        status: ValidWordStateEnum.NOT_DEFINED,
        message: 'Error',
      })
    }

    if (validWordCheck.status === ValidWordStateEnum.MATCHES) {
      await this.gamePort.broadcastError(session)
      return response.ok({
        status: ValidWordStateEnum.MATCHES,
        message: 'Error',
      })
    }

    if (validWordCheck.status !== ValidWordStateEnum.VALID) {
      await this.gamePort.broadcastError(session)
      return response.ok({
        status: 'INVALID',
        message: 'Error',
      })
    }
    // ------------------------------

    const isHintGiver = session.hintGiver === user.id
    const isCorrect = this.gameRules.validateAnswer(session, answer, user.id)
    const hasMaxAttempts = session.wordsList.hintGiver.length > 4
    const isOver = hasMaxAttempts || isCorrect
    const updatedSession = isHintGiver
      ? this.gameRules.updateSessionForHintGiver(session, answer)
      : this.gameRules.updateSessionForGuesser(session, answer, isOver, isCorrect)

    await this.handleSessionUpdate(updatedSession, isOver, isCorrect)
    return response.ok({
      status: ValidWordStateEnum.VALID,
      message: 'Success',
    })
  }

  private async handleSessionUpdate(updatedSession: GameSession, isOver: boolean, win = false): Promise<void> {
    await this.gamePort.updateSession(updatedSession)
    await this.gamePort.broadcastAnswer(updatedSession, isOver, win)
    if (isOver) {
      await this.gamePort.saveToGameHistory(updatedSession)
    }
  }
}
