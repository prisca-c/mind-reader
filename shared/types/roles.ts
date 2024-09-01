export const RolesEnum = {
  HINT_GIVER: 'hintGiver',
  GUESSER: 'guesser',
} as const

export type Role = (typeof RolesEnum)[keyof typeof RolesEnum]
