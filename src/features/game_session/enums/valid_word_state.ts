export const ValidWordStateEnum = {
  NOT_DEFINED: 'NOT_DEFINED',
  MATCHES: 'MATCHES',
  VALID: 'VALID',
} as const

export type ValidWordState = (typeof ValidWordStateEnum)[keyof typeof ValidWordStateEnum]
