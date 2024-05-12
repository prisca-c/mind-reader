import type { HttpContext } from '@adonisjs/core/http'

export default class GameController {
  render({ inertia }: HttpContext) {
    return inertia.render('game')
  }
}
