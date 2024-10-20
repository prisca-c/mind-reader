import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'providers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id', { primaryKey: true })
      table.string('name').unique().notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
