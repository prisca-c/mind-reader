import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  render({ inertia }: HttpContext) {
    return inertia.render('home')
  }
}
