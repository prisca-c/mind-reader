export const WordValidationStateEnum = {
  VALID: 'valid',
  NULL: 'null',
  MANY_WORDS: 'many_words',
  INVALID_CHARACTERS: 'invalid_characters',
  INVALID: 'invalid',
} as const

export type WordValidationState =
  (typeof WordValidationStateEnum)[keyof typeof WordValidationStateEnum]
