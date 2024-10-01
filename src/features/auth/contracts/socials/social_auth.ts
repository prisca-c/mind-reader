import env from '#start/env'
import User from '#models/user'
import { type SocialAuthState, SocialAuthStateEnum } from '#features/auth/enums/social_auth_state'
import { ResponseService } from '#services/reponse_service'
import { inject } from '@adonisjs/core'
import { UserPort } from '#features/user/contracts/user_port'
import { ProviderPort } from '#features/provider/contracts/provider_port'

@inject()
export class SocialAuth {
  constructor(
    protected responseService: ResponseService,
    protected userRepository: UserPort,
    protected providerRepository: ProviderPort
  ) {}

  async handle(
    socialProvider: any,
    providerParams: string
  ): Promise<{ status: SocialAuthState; payload: User | null }> {
    const bypassLogin = env.get('BYPASS_LOGIN')
    const nodeEnv = env.get('NODE_ENV')

    let user

    if (bypassLogin && nodeEnv === `development`) {
      user = await this.userRepository.findOrCreate('random@user.com', {
        username: 'RandomUser',
        avatarUrl: null,
        providerId: 1,
      })
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

      const provider = await this.providerRepository.findByOrFail('name', providerParams)
      user = await this.userRepository.findOrCreate(socialUser.email, {
        username: socialUser.nickName,
        avatarUrl: socialUser.avatarUrl,
        providerId: provider.id,
      })
    } else {
      // TODO: Better handling of else exception
      return this.responseService.handle(SocialAuthStateEnum.UNEXPECTED_ERROR, null)
    }

    return this.responseService.handle(SocialAuthStateEnum.SUCCESS, user)
  }
}
