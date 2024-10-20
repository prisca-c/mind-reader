import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'game_histories'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('session_id').notNullable()
      table.uuid('hint_giver_id').references('id').inTable('users').notNullable()
      table.uuid('guesser_id').references('id').inTable('users').notNullable()
      table.uuid('word_id').references('id').inTable('words').notNullable()
      table.boolean('guessed').notNullable()
      table.dateTime('date').notNullable()
      table.jsonb('words_list').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
