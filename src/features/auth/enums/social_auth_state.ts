export const SocialAuthStateEnum = {
  ACCESS_DENIED: 'access_denied',
  STATE_MISMATCH: 'state_mismatch',
  ERROR: 'error',
  UNEXPECTED_ERROR: 'unexpected_error',
  SUCCESS: 'success',
} as const

export type SocialAuthState = (typeof SocialAuthStateEnum)[keyof typeof SocialAuthStateEnum]
