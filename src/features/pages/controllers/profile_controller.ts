import type { HttpContext } from '@adonisjs/core/http'
import { assert } from '#helpers/assert'
import { GameNormalized } from '#shared/types/game_normalized'
import { RolesEnum } from '#shared/types/roles'

export default class SearchGameController {
  async render({ inertia, auth, response }: HttpContext) {
    if (!(await auth.check())) {
      return response.redirect('/login')
    }

    const user = auth.user
    assert(user)

    await user.load('guesserGames', (query) => {
      query.preload('word').preload('hintGiver')
    })
    await user.load('hintGiverGames', (query) => {
      query.preload('word').preload('guesser')
    })

    const games: GameNormalized[] = []

    user.guesserGames.forEach((game) => {
      games.push({
        id: game.id,
        date: game.createdAt.toLocaleString(),
        guessed: game.guessed,
        role: RolesEnum.GUESSER,
        opponent: game.hintGiver.username,
        word: game.word.name,
      })
    })

    user.hintGiverGames.forEach((game) => {
      games.push({
        id: game.id,
        date: game.createdAt.toLocaleString(),
        guessed: game.guessed,
        role: RolesEnum.HINT_GIVER,
        opponent: game.guesser.username,
        word: game.word.name,
      })
    })

    return inertia.render('profile', {
      user: user,
      games: games,
    })
  }
}
