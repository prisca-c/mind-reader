import type { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { Opaque } from '@poppinss/utils/types'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Role from '#models/role'
import GameHistory from '#models/game_history'
import { randomUUID } from 'node:crypto'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['username', 'email'],
  passwordColumnName: 'password',
})

export type UserId = Opaque<string, 'UserId'>

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: UserId

  @column()
  declare username: string

  @column()
  declare email: string

  @column()
  declare emailVerifiedAt: DateTime | null

  @column()
  declare avatarUrl: string | null

  @column()
  declare roleId: number

  @column()
  declare providerId: number

  @column()
  declare password: string | null

  @column()
  declare elo: number

  @column()
  declare lastSessionId: string | null

  @column()
  declare lastSessionAt: DateTime | null

  @column.dateTime()
  declare bannedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @hasMany(() => GameHistory, {
    foreignKey: 'hintGiverId',
  })
  declare hintGiverGames: HasMany<typeof GameHistory>

  @hasMany(() => GameHistory, {
    foreignKey: 'guesserId',
  })
  declare guesserGames: HasMany<typeof GameHistory>

  @beforeCreate()
  static generateId(user: User) {
    user.id = randomUUID() as UserId
  }

  @beforeCreate()
  static async roleDefault(user: User) {
    if (!user.roleId) {
      const role = await Role.query().where('name', 'user').firstOrFail()
      user.roleId = role.id
    }
  }
}
