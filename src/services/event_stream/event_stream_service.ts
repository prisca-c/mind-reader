import transmit from '@adonisjs/transmit/services/main'
import { EventStreamInterface } from '#services/event_stream/event_stream_interface'
import type { Broadcastable } from '@adonisjs/transmit/types'

export class EventStreamService implements EventStreamInterface {
  broadcast(channel: string, payload: Broadcastable): void {
    transmit.broadcast(channel, payload)
  }
}
