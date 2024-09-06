import type { HttpContext } from '@adonisjs/core/http'

export default class LandingPageController {
  render({ inertia }: HttpContext) {
    return inertia.render('landing_page')
  }
}
