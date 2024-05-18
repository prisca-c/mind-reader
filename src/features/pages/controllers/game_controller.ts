import type { HttpContext } from '@adonisjs/core/http'

export default class GameController {
  render({ inertia, auth, response }: HttpContext) {
    if (!auth.user) {
      return response.redirect('/login')
    }

    return inertia.render('game')
  }
}
