import type { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { Opaque } from '@poppinss/utils/types'

export type ProviderId = Opaque<number, 'ProviderId'>

export default class Provider extends BaseModel {
  @column({ isPrimary: true })
  declare id: ProviderId

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
