import Provider from '#models/provider'

export abstract class ProviderPort {
  public abstract findByOrFail(column: keyof Provider, value: any): Promise<Provider>
}
