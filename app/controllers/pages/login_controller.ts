import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  render({ inertia }: HttpContext) {
    return inertia.render('login')
  }
}
