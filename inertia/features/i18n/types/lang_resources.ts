import type { LandingPageI18N } from '~/features/i18n/types/landing_page_i18n'
import type { LoginI18N } from '~/features/i18n/types/login_i18n'
import type { HomeI18N } from '~/features/i18n/types/home_i18n'
import type { GameSessionI18N } from '~/features/i18n/types/game_session_i18n'

export interface LangResources {
  landingPage: LandingPageI18N
  login: LoginI18N
  home: HomeI18N
  gameSession: GameSessionI18N
}
