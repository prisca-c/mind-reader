import type { HttpContext } from '@adonisjs/core/http'

export default class LandingPageController {
  public render({ inertia }: HttpContext) {
    return inertia.render('landing_page')
  }
}
