import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  public render({ inertia }: HttpContext) {
    return inertia.render('login')
  }
}
