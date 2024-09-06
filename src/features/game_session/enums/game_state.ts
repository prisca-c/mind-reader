export const GameState = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  WIN: 'win',
  LOSE: 'lose',
  ERROR: 'error',
} as const

export type GameStateEnum = (typeof GameState)[keyof typeof GameState]
