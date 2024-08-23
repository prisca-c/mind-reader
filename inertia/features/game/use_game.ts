import React, { useEffect, useState } from 'react'
import { GameState, GameStateEnum } from '#features/game_session/enums/game_state'
import { useTransmit } from '~/hooks/use_transmit'
import type { GameSessionProps } from '~/pages/game_session'
import { Api } from '~/services/api'
import type { WordList } from '#features/game_session/types/game_session'
import type { GameResponseStatus } from '~/features/game/types/game_response_status'
import {
  type WordValidationState,
  WordValidationStateEnum,
} from '~/features/game/enums/word_validation_state'
import { ValidWordState, ValidWordStateEnum } from '#features/game_session/enums/valid_word_state'
import { SessionState, SessionStateEnum } from '#features/game_session/enums/session_state'
import { useTimer } from '~/hooks/use_timer'
import { DateTime } from 'luxon'

type Props = GameSessionProps
export type WordStateProps = { valid: boolean; status: WordValidationState }
export const useGame = (props: Props) => {
  const { sessionId, user, wordsList, turn, word, sessionState, sessionDate } = props

  const [wordToGuess, setWordToGuess] = useState<string | null>(null)
  const [wordState, setWordState] = useState<WordStateProps>({
    valid: false,
    status: WordValidationStateEnum.INVALID,
  })
  const [hintGiverWords, setHintGiverWords] = useState<string[]>([])
  const [guesserWords, setGuesserWords] = useState<string[]>([])
  const [gameState, setGameState] = useState<GameStateEnum | SessionState>(GameState.WAITING)

  const timeLeft: number = DateTime.fromISO(sessionDate)
    .plus({ minutes: 1, seconds: 30 })
    .diffNow()
    .as('seconds')

  const { timer, isActive, setIsActive } = useTimer(Number(timeLeft.toFixed(0)))

  const sessionListener = useTransmit({ url: `game/session/${sessionId}/user/${user.id}` })

  useEffect(() => {
    if (word) {
      setWordToGuess(word)
    }

    if (turn) {
      setGameState('playing')
    }

    if (!turn) {
      setGameState('waiting')
    }

    if (wordsList) {
      setHintGiverWords(wordsList.hintGiver)
      setGuesserWords(wordsList.guesser)
    }

    if (sessionState === SessionStateEnum.READY) {
      new Api().get(`/game/session/${sessionId}/ready`)
    }

    if (sessionState === SessionStateEnum.PLAYING) {
      setIsActive(true)
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const answer = formData.get('answer') as string

    if (
      gameState === GameState.WAITING ||
      gameState === GameState.WIN ||
      gameState === GameState.LOSE
    ) {
      return
    }

    new Api()
      .post<{
        status: ValidWordState
        message: string
      }>(`/game/session/${sessionId}/answer`, { answer })
      .then((response) => {
        if (response.status === ValidWordStateEnum.MATCHES) {
          setWordState({ valid: false, status: WordValidationStateEnum.MATCHES })
          return
        } else if (response.status === ValidWordStateEnum.VALID) {
          form.reset()
          return
        }
      })
  }

  const wordOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const answer = event.target.value
    const haveOnlyLetters = /^[A-Za-zÀ-ÖØ-öø-ÿ]+$/.test(answer)
    const haveOnlyOneWord = answer.split(' ').length === 1

    if (!answer) {
      setWordState({ valid: false, status: WordValidationStateEnum.NULL })
      return
    }

    if (!haveOnlyOneWord) {
      setWordState({ valid: false, status: WordValidationStateEnum.MANY_WORDS })
      return
    }

    if (!haveOnlyLetters) {
      setWordState({ valid: false, status: WordValidationStateEnum.INVALID_CHARACTERS })
      return
    }

    setWordState({ valid: true, status: WordValidationStateEnum.VALID })
  }

  const handleGameState = (message: {
    turn: boolean
    word: string | null
    wordsList?: string
    status?: GameResponseStatus
    sessionState: SessionState
  }) => {
    if (message.wordsList) {
      const words: WordList = JSON.parse(message.wordsList)
      setHintGiverWords(words.hintGiver)
      setGuesserWords(words.guesser)
    }

    if (message.word) {
      setWordToGuess(message.word)
    }

    if (message.status === GameState.WIN) {
      setGameState(GameState.WIN)
      setIsActive(false)
    } else if (message.status === GameState.LOSE) {
      setGameState(GameState.LOSE)
      setIsActive(false)
    } else if (message.turn) {
      setGameState(GameState.PLAYING)
    } else {
      setGameState(GameState.WAITING)
    }

    if (message.sessionState) {
      if (message.sessionState === SessionStateEnum.PLAYING) {
        setGameState(SessionStateEnum.PLAYING)
        setIsActive(true)
      }
    }
  }

  const handleCopySessionId = () => {
    navigator.clipboard.writeText(sessionId).then(() => alert('Session ID copied'))
  }

  return {
    sessionListener,
    guesserWords,
    hintGiverWords,
    gameState,
    handleSubmit,
    handleGameState,
    handleCopySessionId,
    wordState,
    wordOnChange,
    wordToGuess,
    timer,
    isActive,
  }
}
