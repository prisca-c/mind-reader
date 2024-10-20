import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { Opaque } from '@poppinss/utils/types'
import type { DateTime } from 'luxon'

export type ProviderId = Opaque<number, 'ProviderId'>

export default class Provider extends BaseModel {
  @column({ isPrimary: true })
  public declare id: ProviderId

  @column()
  public declare name: string

  @column.dateTime({ autoCreate: true })
  public declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public declare updatedAt: DateTime
}
