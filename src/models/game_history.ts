import { randomUUID } from 'node:crypto'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { Opaque } from '@poppinss/utils/types'
import { DateTime } from 'luxon'
import type { WordList } from '#features/game_session/types/game_session'
import User, { type UserId } from '#models/user'
import Word, { type WordId } from '#models/word'

export type GameHistoryId = Opaque<string, 'GameHistoryId'>

export default class GameHistory extends BaseModel {
  @column({ isPrimary: true })
  public declare id: GameHistoryId

  @column()
  public declare sessionId: string

  @column()
  public declare hintGiverId: UserId

  @column()
  public declare guesserId: UserId

  @column()
  public declare wordId: WordId

  @column()
  public declare guessed: boolean

  @column()
  public declare date: DateTime

  @column()
  public declare wordsList: WordList

  @beforeCreate()
  public static generateId(gameHistory: GameHistory) {
    gameHistory.id = randomUUID() as GameHistoryId
  }

  @belongsTo(() => Word)
  public declare word: BelongsTo<typeof Word>

  @belongsTo(() => User, { foreignKey: 'hintGiverId' })
  public declare hintGiver: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'guesserId' })
  public declare guesser: BelongsTo<typeof User>
}
