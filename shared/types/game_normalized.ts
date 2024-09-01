import type { Role } from '#shared/types/roles'

export interface GameNormalized {
  id: string
  date: string
  guessed: boolean
  role: Role
  opponent: string
  word: string
}
