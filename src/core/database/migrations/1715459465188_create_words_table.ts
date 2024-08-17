import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'words'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable()
      table.integer('found_count').defaultTo(0)
      table.integer('played_count').defaultTo(0)
      table.integer('difficulty').defaultTo(1)
      table.string('language').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
