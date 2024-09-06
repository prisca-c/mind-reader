import type { UserId } from '#models/user'

export interface Player {
  id: UserId
  username: string
  elo: number
}
