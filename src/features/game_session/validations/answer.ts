import vine from '@vinejs/vine'

export const answerValidator = vine.compile(
  vine.object({
    answer: vine
      .string()
      .trim()
      .regex(/[A-Za-zÀ-ÖØ-öø-ÿ]/),
  })
)
