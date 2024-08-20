export const SessionStateEnum = {
  MATCHMAKING: 'matchmaking',
  READY: 'ready',
  PLAYING: 'playing',
} as const

export type SessionState = (typeof SessionStateEnum)[keyof typeof SessionStateEnum]
