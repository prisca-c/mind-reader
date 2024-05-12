import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { Opaque } from '@poppinss/utils/types'

export type WordId = Opaque<string, 'WordId'>

export default class Word extends BaseModel {
  @column({ isPrimary: true })
  declare id: WordId

  @column()
  declare name: string

  @column()
  declare foundCount: number

  @column()
  declare playedCount: number

  @column()
  declare difficulty: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
