import React, { useEffect, useReducer } from 'react'
import { GameState, GameStateEnum } from '#features/game_session/enums/game_state'
import { useTransmit } from '~/hooks/use_transmit'
import type { GameSessionProps, SessionListenerMessage } from '~/pages/game_session'
import { Api } from '~/services/api'
import {
  WordValidationState,
  WordValidationStateEnum,
} from '~/features/game/enums/word_validation_state'
import { ValidWordState, ValidWordStateEnum } from '#features/game_session/enums/valid_word_state'
import { SessionState, SessionStateEnum } from '#features/game_session/enums/session_state'
import { useTimer } from '~/hooks/use_timer'
import { DateTime } from 'luxon'
import { RolesEnum } from '~/enums/roles'
import { WordList } from '#features/game_session/types/game_session'

export type WordStateProps = { valid: boolean; status: WordValidationState }

interface GameState {
  wordToGuess: string | null
  wordState: WordStateProps
  hintGiverWords: string[]
  guesserWords: string[]
  gameState: GameStateEnum | SessionState
  turnState: boolean | null
  opponent: string | null
}

type GameAction =
  | { type: 'SET_WORD_TO_GUESS'; payload: string | null }
  | { type: 'SET_WORD_STATE'; payload: WordStateProps }
  | { type: 'SET_HINT_GIVER_WORDS'; payload: string[] }
  | { type: 'SET_GUESSER_WORDS'; payload: string[] }
  | { type: 'SET_GAME_STATE'; payload: GameStateEnum | SessionState }
  | { type: 'SET_TURN_STATE'; payload: boolean | null }
  | { type: 'SET_OPPONENT'; payload: string | null }

const initialState: GameState = {
  wordToGuess: null,
  wordState: { valid: false, status: WordValidationStateEnum.INVALID },
  hintGiverWords: [],
  guesserWords: [],
  gameState: GameState.WAITING,
  turnState: null,
  opponent: null,
}

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_WORD_TO_GUESS':
      return { ...state, wordToGuess: action.payload }
    case 'SET_WORD_STATE':
      return { ...state, wordState: action.payload }
    case 'SET_HINT_GIVER_WORDS':
      return { ...state, hintGiverWords: action.payload }
    case 'SET_GUESSER_WORDS':
      return { ...state, guesserWords: action.payload }
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.payload }
    case 'SET_TURN_STATE':
      return { ...state, turnState: action.payload }
    case 'SET_OPPONENT':
      return { ...state, opponent: action.payload }
    default:
      return state
  }
}

export const useGame = (props: GameSessionProps) => {
  const { sessionId, user, wordsList, turn, word, sessionState, sessionDate, gameLength, role } =
    props

  const [state, dispatch] = useReducer(gameReducer, initialState)

  const timeLeft: number = DateTime.fromISO(sessionDate)
    .plus({ seconds: gameLength })
    .diffNow()
    .as('seconds')

  const { timer, isActive, setIsActive } = useTimer(Number(timeLeft.toFixed(0)))
  const sessionListener = useTransmit({ url: `game/session/${sessionId}/user/${user.id}` })

  useEffect(() => {
    if (word) {
      dispatch({ type: 'SET_WORD_TO_GUESS', payload: word })
    }
    dispatch({ type: 'SET_TURN_STATE', payload: turn })

    if (wordsList) {
      dispatch({ type: 'SET_HINT_GIVER_WORDS', payload: wordsList.hintGiver })
      dispatch({ type: 'SET_GUESSER_WORDS', payload: wordsList.guesser })
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
      state.gameState === GameState.WAITING ||
      state.gameState === GameState.WIN ||
      state.gameState === GameState.LOSE
    ) {
      return
    }

    const response: { status: ValidWordState } = await new Api().post(
      `/game/session/${sessionId}/answer`,
      { answer }
    )

    if (response.status === ValidWordStateEnum.MATCHES) {
      dispatch({
        type: 'SET_WORD_STATE',
        payload: { valid: false, status: WordValidationStateEnum.MATCHES },
      })
    }

    form.reset()
  }

  const wordOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const answer = event.target.value
    const haveOnlyLetters = /^[A-Za-zÀ-ÖØ-öø-ÿ]+$/.test(answer)
    const haveOnlyOneWord = answer.split(' ').length === 1

    if (!answer) {
      dispatch({
        type: 'SET_WORD_STATE',
        payload: { valid: false, status: WordValidationStateEnum.NULL },
      })
      return
    }

    if (!haveOnlyOneWord) {
      dispatch({
        type: 'SET_WORD_STATE',
        payload: { valid: false, status: WordValidationStateEnum.MANY_WORDS },
      })
      return
    }

    if (!haveOnlyLetters) {
      dispatch({
        type: 'SET_WORD_STATE',
        payload: { valid: false, status: WordValidationStateEnum.INVALID_CHARACTERS },
      })
      return
    }

    dispatch({
      type: 'SET_WORD_STATE',
      payload: { valid: true, status: WordValidationStateEnum.VALID },
    })
  }

  const handleGameState = (message: SessionListenerMessage) => {
    if (message.wordsList) {
      const words: WordList = JSON.parse(message.wordsList)
      dispatch({ type: 'SET_HINT_GIVER_WORDS', payload: words.hintGiver })
      dispatch({ type: 'SET_GUESSER_WORDS', payload: words.guesser })
    }

    if (message.word) {
      dispatch({ type: 'SET_WORD_TO_GUESS', payload: message.word })
    }

    if (message.opponent) {
      dispatch({ type: 'SET_OPPONENT', payload: message.opponent })
    }

    if (message.turn !== null) {
      dispatch({ type: 'SET_TURN_STATE', payload: message.turn })
    }

    if (message.status === GameState.WIN || message.status === GameState.LOSE) {
      dispatch({ type: 'SET_GAME_STATE', payload: message.status })
      setIsActive(false)
    } else if (message.turn) {
      dispatch({ type: 'SET_TURN_STATE', payload: message.turn })
      dispatch({ type: 'SET_GAME_STATE', payload: GameState.PLAYING })
    } else {
      dispatch({ type: 'SET_GAME_STATE', payload: GameState.WAITING })
    }

    if (message.sessionState && message.sessionState === SessionStateEnum.PLAYING) {
      if (role === RolesEnum.HINT_GIVER) {
        dispatch({ type: 'SET_TURN_STATE', payload: true })
      }
      dispatch({ type: 'SET_GAME_STATE', payload: SessionStateEnum.PLAYING })
      setIsActive(true)
    }
  }

  const handleCopySessionId = () => {
    navigator.clipboard.writeText(sessionId).then(() => alert('Session ID copied'))
  }

  const isGameOver = state.gameState === GameState.WIN || state.gameState === GameState.LOSE

  return {
    sessionListener,
    guesserWords: state.guesserWords,
    hintGiverWords: state.hintGiverWords,
    gameState: state.gameState,
    opponent: state.opponent,
    handleSubmit,
    handleGameState,
    handleCopySessionId,
    wordState: state.wordState,
    wordOnChange,
    wordToGuess: state.wordToGuess,
    turnState: state.turnState,
    timer,
    isActive,
    isGameOver,
  }
}
