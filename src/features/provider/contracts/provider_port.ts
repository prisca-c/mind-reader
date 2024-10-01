import Provider from '#models/provider'

export abstract class ProviderPort {
  abstract findByOrFail(column: keyof Provider, value: any): Promise<Provider>
}
