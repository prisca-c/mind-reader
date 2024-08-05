export const ValidWordState = {
  NOT_DEFINED: 'NOT_DEFINED',
  MATCHES: 'MATCHES',
  VALID: 'VALID',
} as const

export type ValidWordEnum = (typeof ValidWordState)[keyof typeof ValidWordState]
