import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { replaceURLs } from '#helpers/text'
import { EventStreamService } from '#services/event_stream/event_stream_service'

export default class ChatController {
  @inject()
  public store({ request, response, auth }: HttpContext, eventStream: EventStreamService) {
    const { message } = request.only(['message'])

    if (!message) {
      return response.redirect().back()
    }

    const username = auth.user!.username
    const sanitizedMessage = replaceURLs(message)

    eventStream.broadcast('chat', {
      timestamp: `${DateTime.now().toFormat('MM/dd/yyyy HH:mm')}`,
      username,
      message: sanitizedMessage,
    })

    return response.ok({ message: 'Message sent' })
  }
}
