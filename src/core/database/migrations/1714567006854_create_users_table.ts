import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('username').notNullable()
      table.string('email', 254).notNullable().unique()
      table.timestamp('email_verified_at').nullable()
      table.string('password').nullable()
      table.string('avatar_url').nullable()
      table.integer('elo').defaultTo(500)
      table.integer('role_id').unsigned().notNullable().references('id').inTable('roles')
      table
        .smallint('provider_id')
        .unsigned()
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('providers')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.string('last_session_id').nullable()
      table.timestamp('last_session_at', { useTz: true }).nullable()

      table.timestamp('banned_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
