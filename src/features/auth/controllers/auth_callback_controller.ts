import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Provider from '#models/provider'
import User from '#models/user'

export default class AuthCallbackController {
  async handle({ ally, auth, response, params, session }: HttpContext) {
    const providerParams = params.provider
    const socialProvider = ally.use(providerParams)

    if (
      socialProvider.accessDenied() ||
      socialProvider.stateMisMatch() ||
      socialProvider.hasError()
    ) {
      return response.redirect('/login')
    }

    const socialUser = await socialProvider.user()

    if (socialUser) {
      const provider = await Provider.findByOrFail('name', providerParams)
      await User.firstOrCreate(
        { email: socialUser.email },
        {
          email: socialUser.email,
          username: socialUser.nickName,
          avatarUrl: socialUser.avatarUrl,
          providerId: provider.id,
        }
      )

      const user = await User.findByOrFail('email', socialUser.email)
      await auth.use('web').login(user)

      user.lastSessionId = session.sessionId
      user.lastSessionAt = DateTime.now()
      await user.save()

      return response.redirect('/game')
    }
    return response.redirect('/')
  }
}
