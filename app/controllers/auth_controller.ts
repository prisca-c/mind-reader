import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Provider from '#models/provider'
import { DateTime } from 'luxon'

export default class AuthController {
  async callback({ ally, auth, response, params, session }: HttpContext) {
    const providerParams = params.provider
    const socialProvider = ally.use(providerParams)

    if (
      socialProvider.accessDenied() ||
      socialProvider.stateMisMatch() ||
      socialProvider.hasError()
    ) {
      return response.redirect('/login')
    }

    const user = await socialProvider.user()

    if (user) {
      const provider = await Provider.findByOrFail('name', providerParams)
      await User.firstOrCreate(
        { email: user.email },
        {
          email: user.email,
          username: user.nickName,
          avatarUrl: user.avatarUrl,
          providerId: provider.id,
        }
      )

      await auth.use('web').login(user)

      user.lastSessionId = session.sessionId
      user.lastSessionAt = DateTime.now()
      await user.save()

      return response.redirect('/')
    }
    return response.redirect('/')
  }
}
