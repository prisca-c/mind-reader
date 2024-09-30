import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

export default class AuthRedirectController {
  async handle({ ally, params, response }: HttpContext) {
    const bypassLogin = env.get('BYPASS_LOGIN')
    const nodeEnv = env.get('NODE_ENV')

    if (bypassLogin && nodeEnv === 'development') {
      return response.redirect('/auth/twitch/callback')
    }

    const providerParams = params.provider
    const socialProvider = ally.use(providerParams)
    return await socialProvider.redirect()
  }
}
