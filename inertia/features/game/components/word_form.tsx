import React from 'react'
import type { Role } from '#shared/types/roles'
import type { WordStateProps } from '~/features/game/use_game'
import { useTranslation } from 'react-i18next'
import {
  type WordValidationState,
  WordValidationStateEnum,
} from '~/features/game/enums/word_validation_state'
import { TFunction } from 'i18next'

type WordFormProps = {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  wordOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  role: Role
  wordState: WordStateProps
  timerIsActive: boolean
}

const ErrorPrompt = (status: WordValidationState, i18n: TFunction) => {
  switch (status) {
    case WordValidationStateEnum.NULL:
      return i18n('gameSession.errors.empty')
    case WordValidationStateEnum.MATCHES:
      return i18n('gameSession.errors.matches')
    case WordValidationStateEnum.MANY_WORDS:
      return i18n('gameSession.errors.manyWords')
    case WordValidationStateEnum.INVALID_CHARACTERS:
      return i18n('gameSession.errors.invalidCharacter')
    default:
      return i18n('gameSession.errors.wordInvalid')
  }
}

export const WordForm = (props: WordFormProps) => {
  const { t } = useTranslation()
  const { handleSubmit, wordOnChange, role, wordState } = props
  return (
    <form onSubmit={handleSubmit}>
      {!wordState.valid && <p className="text-red">{ErrorPrompt(wordState.status, t)}</p>}
      <input type="text" name="answer" onChange={wordOnChange} required />
      <button disabled={!wordState.valid || !props.timerIsActive}>
        {t(`gameSession.buttons.submit.${role}`)}
      </button>
    </form>
  )
}
