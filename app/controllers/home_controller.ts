import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  handle({ inertia }: HttpContext) {
    return inertia.render('home')
  }
}
