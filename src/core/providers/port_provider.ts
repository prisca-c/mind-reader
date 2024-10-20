import type { ApplicationService } from '@adonisjs/core/types'
import { GamePort } from '#features/game_session/contracts/game/game_port'
import { ProviderPort } from '#features/provider/contracts/provider_port'
import { UserPort } from '#features/user/contracts/user_port'
import { CacheService } from '#services/cache/cache_service'
import { EventStreamService } from '#services/event_stream/event_stream_service'

export default class PortProvider {
  public constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  public async register() {
    const { GameDatabaseAdapter } = await import('#features/game_session/contracts/game/game_database_adapter')

    this.app.container.singleton(GamePort, () => {
      return new GameDatabaseAdapter(new CacheService(), new EventStreamService())
    })

    const { UserDatabaseAdapter } = await import('#features/user/contracts/user_database_adapter')

    this.app.container.singleton(UserPort, () => {
      return new UserDatabaseAdapter()
    })

    const { ProviderDatabaseAdapter } = await import('#features/provider/contracts/provider_database_adapter')

    this.app.container.singleton(ProviderPort, () => {
      return new ProviderDatabaseAdapter()
    })
  }

  /**
   * The container bindings have booted
   */
  public async boot() {}

  /**
   * The application has been booted
   */
  public async start() {}

  /**
   * The process has been started
   */
  public async ready() {}

  /**
   * Preparing to shutdown the app
   */
  public async shutdown() {}
}
