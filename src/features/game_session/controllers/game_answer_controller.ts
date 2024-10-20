import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { GameUseCase } from '#features/game_session/contracts/game/game_use_case'
export default class GameAnswerController {
  @inject()
  public async handle(ctx: HttpContext, gameUseCase: GameUseCase) {
    return gameUseCase.handle(ctx)
  }
}
