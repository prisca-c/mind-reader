import transmit from '@adonisjs/transmit/services/main'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class ChatsController {
  store({ request, response, auth }: HttpContext) {
    const { message } = request.only(['message'])

    if (!message) {
      return response.redirect().back()
    }
    const username = auth.user?.username

    transmit.broadcast('chat', {
      message: `[${DateTime.now().toFormat('DD H:mm:ss')}] ${username}: ${message}`,
    })

    return response.ok({ message: 'Message sent' })
  }
}
