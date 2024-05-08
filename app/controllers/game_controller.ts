import type { HttpContext } from '@adonisjs/core/http'

export default class GameController {
  handle({ inertia }: HttpContext) {
    return inertia.render('game')
  }
}
