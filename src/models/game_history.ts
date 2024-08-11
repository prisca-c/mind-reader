import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { Opaque } from '@poppinss/utils/types'
import type { UserId } from '#models/user'
import type { WordId } from '#models/word'
import type { WordList } from '#features/game_session/types/game_session'
import { randomUUID } from 'node:crypto'

export type GameHistoryId = Opaque<string, 'GameHistoryId'>

export default class GameHistory extends BaseModel {
  @column({ isPrimary: true })
  declare id: GameHistoryId

  @column()
  declare sessionId: string

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
  declare wordsList: WordList

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static generateId(gameHistory: GameHistory) {
    gameHistory.id = randomUUID() as GameHistoryId
  }
}
