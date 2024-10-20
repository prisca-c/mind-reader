import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { SocialAuth } from '#features/auth/contracts/social_auth'
import { SocialAuthStateEnum } from '#features/auth/enums/social_auth_state'

@inject()
export default class AuthCallbackController {
  public constructor(protected socialAuth: SocialAuth) {}

  public async handle({ ally, auth, response, params, session }: HttpContext) {
    const providerParams = params.provider
    const socialProvider = ally.use(providerParams)

    const socialAuthResponse = await this.socialAuth.handle(socialProvider, providerParams)

    if (socialAuthResponse.status !== SocialAuthStateEnum.SUCCESS || !socialAuthResponse.payload) {
      return response.redirect('/login')
    }

    const user = socialAuthResponse.payload

    await auth.use('web').login(user)

    user.lastSessionId = session.sessionId
    user.lastSessionAt = DateTime.now()
    await user.save()

    return response.redirect('/game')
  }
}
