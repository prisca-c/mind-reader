import type { HttpContext } from '@adonisjs/core/http'

export default class AuthRedirectController {
  async handle({ ally, params }: HttpContext) {
    const providerParams = params.provider
    const socialProvider = ally.use(providerParams)
    return await socialProvider.redirect()
  }
}
