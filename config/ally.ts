import { defineConfig } from '@adonisjs/ally'
import { twitch } from '@rlanz/ally-twitch'
import env from '#start/env'

const allyConfig = defineConfig({
  twitch: twitch({
    clientId: env.get('TWITCH_CLIENT_ID'),
    clientSecret: env.get('TWITCH_CLIENT_SECRET'),
    callbackUrl: env.get('TWITCH_CALLBACK_URL'),
  }),
})

export default allyConfig

declare module '@adonisjs/ally/types' {
  interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}
