export const GameStatus = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  WIN: 'win',
  LOSE: 'lose',
} as const

export type GameStatusEnum = (typeof GameStatus)[keyof typeof GameStatus]
