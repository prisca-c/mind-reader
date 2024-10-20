import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Word from '#models/word'

export default class extends BaseSeeder {
  public async run() {
    const wordsEn: Partial<Word>[] = [
      {
        name: 'apple',
        language: 'en',
      },
      {
        name: 'banana',
        language: 'en',
      },
      {
        name: 'cherry',
        language: 'en',
      },
      {
        name: 'date',
        language: 'en',
      },
      {
        name: 'elderberry',
        language: 'en',
      },
    ]

    const wordsFr: Partial<Word>[] = [
      {
        name: 'abricot',
        language: 'fr',
      },
      {
        name: 'banane',
        language: 'fr',
      },
      {
        name: 'cerise',
        language: 'fr',
      },
      {
        name: 'datte',
        language: 'fr',
      },
      {
        name: 'framboise',
        language: 'fr',
      },
    ]

    await Word.createMany([...wordsEn, ...wordsFr])
  }
}
