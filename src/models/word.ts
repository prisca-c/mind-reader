import { randomUUID } from 'node:crypto'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { Opaque } from '@poppinss/utils/types'
import { DateTime } from 'luxon'
import type { Language } from '#features/i18n/enums/language'

export type WordId = Opaque<string, 'WordId'>

export default class Word extends BaseModel {
  @column({ isPrimary: true })
  public declare id: WordId

  @column()
  public declare name: string

  @column()
  public declare foundCount: number

  @column()
  public declare playedCount: number

  @column()
  public declare difficulty: number

  @column()
  public declare language: Language

  @column.dateTime({ autoCreate: true })
  public declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public declare updatedAt: DateTime

  @beforeCreate()
  public static generateId(word: Word) {
    word.id = randomUUID() as WordId
  }
}
