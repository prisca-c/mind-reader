import { Broadcastable } from '@adonisjs/transmit/types'

export interface EventStreamInterface {
  broadcast(channel: string, payload: Broadcastable): void
}
