import type { ApplicationService } from '@adonisjs/core/types'
import { GamePort } from '#features/game_session/contracts/game/game_port'
import { CacheService } from '#services/cache/cache_service'
import { EventStreamService } from '#services/event_stream/event_stream_service'
import { UserPort } from '#features/user/contracts/user_port'

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
      return new GameDatabaseAdapter(new CacheService(), new EventStreamService())
    })

    const { UserDatabaseAdapter } = await import('#features/user/contracts/user_database_adapter')

    this.app.container.singleton(UserPort, () => {
      return new UserDatabaseAdapter()
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
