import { randomUUID } from 'node:crypto'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import type { Opaque } from '@poppinss/utils/types'
import type { DateTime } from 'luxon'
import GameHistory from '#models/game_history'
import Role from '#models/role'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['username', 'email'],
  passwordColumnName: 'password',
})

export type UserId = Opaque<string, 'UserId'>

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  public declare id: UserId

  @column()
  public declare username: string

  @column()
  public declare email: string

  @column()
  public declare emailVerifiedAt: DateTime | null

  @column()
  public declare avatarUrl: string | null

  @column()
  public declare roleId: number

  @column()
  public declare providerId: number

  @column()
  public declare password: string | null

  @column()
  public declare elo: number

  @column()
  public declare lastSessionId: string | null

  @column()
  public declare lastSessionAt: DateTime | null

  @column.dateTime()
  public declare bannedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public declare updatedAt: DateTime | null

  @belongsTo(() => Role)
  public declare role: BelongsTo<typeof Role>

  @hasMany(() => GameHistory, {
    foreignKey: 'hintGiverId',
  })
  public declare hintGiverGames: HasMany<typeof GameHistory>

  @hasMany(() => GameHistory, {
    foreignKey: 'guesserId',
  })
  public declare guesserGames: HasMany<typeof GameHistory>

  @beforeCreate()
  public static generateId(user: User) {
    user.id = randomUUID() as UserId
  }

  @beforeCreate()
  public static async roleDefault(user: User) {
    if (!user.roleId) {
      const role = await Role.query().where('name', 'user').firstOrFail()
      user.roleId = role.id
    }
  }
}
