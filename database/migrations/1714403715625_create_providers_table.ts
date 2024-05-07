import { BaseSchema } from '@adonisjs/lucid/schema'
import { DateTime } from 'luxon'

export default class extends BaseSchema {
  protected tableName = 'providers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').unique().notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })

    const providers = ['twitch', 'youtube', 'kick', 'discord']

    this.defer(async () => {
      for (const provider of providers) {
        await this.db.insertQuery().table(this.tableName).insert({
          name: provider,
          created_at: DateTime.now(),
          updated_at: DateTime.now(),
        })
      }
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
