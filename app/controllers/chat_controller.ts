import transmit from '@adonisjs/transmit/services/main'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { replaceURLs } from '#helpers/text'

export default class ChatsController {
  store({ request, response, auth }: HttpContext) {
    const { message } = request.only(['message'])

    if (!message) {
      return response.redirect().back()
    }

    const username = auth.user!.username
    const sanitizedMessage = replaceURLs(message)

    transmit.broadcast('chat', {
      timestamp: `${DateTime.now().toFormat('DD H:mm:ss')}`,
      username,
      message: sanitizedMessage,
    })

    return response.ok({ message: 'Message sent' })
  }
}
