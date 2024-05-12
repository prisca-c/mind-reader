import type { HttpContext } from '@adonisjs/core/http'

export default class PagesController {
  login({ inertia }: HttpContext) {
    return inertia.render('login')
  }

  home({ inertia }: HttpContext) {
    return inertia.render('home')
  }

  game({ inertia, auth, response }: HttpContext) {
    if (!auth.user) {
      return response.redirect('/login')
    }

    return inertia.render('game')
  }
}
