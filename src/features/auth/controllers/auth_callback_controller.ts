import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Provider from '#models/provider'
import User from '#models/user'
import env from '#start/env'

export default class AuthCallbackController {
  async handle({ ally, auth, response, params, session }: HttpContext) {
    const providerParams = params.provider
    const socialProvider = ally.use(providerParams)

    let user

    const bypassLogin = env.get('BYPASS_LOGIN')
    const nodeEnv = env.get('NODE_ENV')

    if (bypassLogin && nodeEnv === `development`) {
      user = await User.firstOrCreate(
        { email: 'random@user.com' },
        {
          username: 'RandomUser',
          avatarUrl: null,
          providerId: 1,
        }
      )
    } else if (socialProvider) {
      if (
        socialProvider.accessDenied() ||
        socialProvider.stateMisMatch() ||
        socialProvider.hasError()
      ) {
        return response.redirect('/login')
      }

      const socialUser = await socialProvider.user()

      const provider = await Provider.findByOrFail('name', providerParams)
      user = await User.firstOrCreate(
        { email: socialUser.email },
        {
          email: socialUser.email,
          username: socialUser.nickName,
          avatarUrl: socialUser.avatarUrl,
          providerId: provider.id,
        }
      )
    } else {
      // TODO: Better handling of else exception
      return response.redirect('/')
    }

    await auth.use('web').login(user)

    user.lastSessionId = session.sessionId
    user.lastSessionAt = DateTime.now()
    await user.save()

    return response.redirect('/game')
  }
}
