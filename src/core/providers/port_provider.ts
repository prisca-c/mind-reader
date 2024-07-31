import type { ApplicationService } from '@adonisjs/core/types'
import { GamePort } from '#features/game_session/contracts/game/game_port'

export default class PortProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  async register() {
    const { GameDatabaseAdapter } = await import(
      '#features/game_session/contracts/game/game_database_adapter'
    )

    this.app.container.singleton(GamePort, () => {
      return new GameDatabaseAdapter()
    })
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
