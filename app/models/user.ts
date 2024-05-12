import type { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { Opaque } from '@poppinss/utils/types'

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

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
