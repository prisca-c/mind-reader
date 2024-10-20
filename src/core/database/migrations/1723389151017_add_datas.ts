import { BaseSchema } from '@adonisjs/lucid/schema'
import { DateTime } from 'luxon'

export default class extends BaseSchema {
  public async up() {
    this.defer(async (db) => {
      await db.table('roles').insert([{ name: 'user' }, { name: 'admin' }])

      const providers = ['twitch', 'youtube', 'kick', 'discord']
      for (const provider of providers) {
        await db.table('providers').insert({
          name: provider,
          created_at: DateTime.now().toISO(),
          updated_at: DateTime.now().toISO(),
        })
      }
    })
  }

  public async down() {}
}
