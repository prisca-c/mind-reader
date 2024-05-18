import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { Opaque } from '@poppinss/utils/types'
import type { UserId } from '#models/user'
import type { WordId } from '#models/word'

export type GameHistoryId = Opaque<string, 'GameHistoryId'>

export default class GameHistory extends BaseModel {
  @column({ isPrimary: true })
  declare id: GameHistoryId

  @column()
  declare hintGiverId: UserId

  @column()
  declare guesserId: UserId

  @column()
  declare wordId: WordId

  @column()
  declare guessed: boolean

  @column()
  declare date: DateTime

  @column()
  declare rounds: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
