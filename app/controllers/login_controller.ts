import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  handle({ inertia }: HttpContext) {
    return inertia.render('login')
  }
}
