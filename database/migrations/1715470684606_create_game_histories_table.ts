import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'game_histories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').defaultTo(this.raw('gen_random_uuid()')).primary()
      table.uuid('player_1_id').references('id').inTable('users').onDelete('CASCADE')
      table.uuid('player_2_id').references('id').inTable('users').onDelete('CASCADE')
      table.uuid('hint_giver_id').references('id').inTable('users').onDelete('CASCADE')
      table.uuid('word_id').references('id').inTable('words').onDelete('CASCADE')
      table.boolean('guessed').notNullable()
      table.dateTime('date').notNullable()
      table.jsonb('rounds').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
