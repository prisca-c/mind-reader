import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import env from '#start/env'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { guards?: (keyof Authenticators)[] } = {}
  ) {
    const isAuthenticated = await ctx.auth.authenticateUsing(options.guards)
    const user = ctx.auth.user
    const currentSessionId = ctx.session.sessionId
    const isTest = env.get('NODE_ENV') === 'test'

    if (isAuthenticated && user?.lastSessionId !== currentSessionId && !isTest) {
      await ctx.auth.use('web').logout()
      ctx.response.redirect(this.redirectTo)
    } else if (!isAuthenticated) {
      ctx.response.redirect(this.redirectTo)
    }

    return next()
  }
}
