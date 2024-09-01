import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  render({ inertia, auth, response }: HttpContext) {
    if (!auth.user) {
      return response.redirect('/login')
    }
    const user = auth.user

    return inertia.render('home', {
      avatarUrl: user.avatarUrl,
      elo: user.elo,
    })
  }
}
