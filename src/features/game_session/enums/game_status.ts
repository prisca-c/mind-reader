export const GameStatus = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  WIN: 'win',
  LOSE: 'lose',
  ERROR: 'error',
} as const

export type GameStatusEnum = (typeof GameStatus)[keyof typeof GameStatus]
