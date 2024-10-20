import transmit from '@adonisjs/transmit/services/main'
import type { Broadcastable } from '@adonisjs/transmit/types'
import { EventStreamInterface } from '#services/event_stream/event_stream_interface'

export class EventStreamService implements EventStreamInterface {
  public broadcast(channel: string, payload: Broadcastable): void {
    transmit.broadcast(channel, payload)
  }
}
