import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public declare id: number

  @column()
  public declare name: string

  @column.dateTime({ autoCreate: true })
  public declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public declare updatedAt: DateTime
}
