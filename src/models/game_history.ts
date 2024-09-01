import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { Opaque } from '@poppinss/utils/types'
import User, { type UserId } from '#models/user'
import Word, { type WordId } from '#models/word'
import type { WordList } from '#features/game_session/types/game_session'
import { randomUUID } from 'node:crypto'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

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

  @beforeCreate()
  static generateId(gameHistory: GameHistory) {
    gameHistory.id = randomUUID() as GameHistoryId
  }

  @belongsTo(() => Word)
  declare word: BelongsTo<typeof Word>

  @belongsTo(() => User, { foreignKey: 'hintGiverId' })
  declare hintGiver: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'guesserId' })
  declare guesser: BelongsTo<typeof User>
}
