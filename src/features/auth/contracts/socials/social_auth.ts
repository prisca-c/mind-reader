import env from '#start/env'
import User from '#models/user'
import Provider from '#models/provider'
import { type SocialAuthState, SocialAuthStateEnum } from '#features/auth/enums/social_auth_state'
import { ResponseService } from '#services/reponse_service'
import { inject } from '@adonisjs/core'

@inject()
export class SocialAuth {
  constructor(protected responseService: ResponseService) {}

  async handle(
    socialProvider: any,
    providerParams: string
  ): Promise<{ status: SocialAuthState; payload: User | null }> {
    const bypassLogin = env.get('BYPASS_LOGIN')
    const nodeEnv = env.get('NODE_ENV')

    let user

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
      switch (socialProvider.state()) {
        case socialProvider.accessDenied():
          return this.responseService.handle(SocialAuthStateEnum.ACCESS_DENIED, null)
        case socialProvider.stateMisMatch():
          return this.responseService.handle(SocialAuthStateEnum.STATE_MISMATCH, null)
        case socialProvider.hasError():
          return this.responseService.handle(SocialAuthStateEnum.ERROR, null)
      }

      const socialUser = await socialProvider.user()

      const provider = await Provider.findByOrFail('name', providerParams)
      user = await User.firstOrCreate(
        { email: socialUser.email },
        {
          username: socialUser.nickName,
          avatarUrl: socialUser.avatarUrl,
          providerId: provider.id,
        }
      )
    } else {
      // TODO: Better handling of else exception
      return this.responseService.handle(SocialAuthStateEnum.UNEXPECTED_ERROR, null)
    }

    return this.responseService.handle(SocialAuthStateEnum.SUCCESS, user)
  }
}
