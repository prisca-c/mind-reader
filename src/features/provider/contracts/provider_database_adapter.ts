import { ProviderPort } from '#features/provider/contracts/provider_port'
import Provider from '#models/provider'

export class ProviderDatabaseAdapter implements ProviderPort {
  public async findByOrFail(column: keyof Provider, value: any): Promise<Provider> {
    return Provider.findByOrFail(column, value)
  }
}
