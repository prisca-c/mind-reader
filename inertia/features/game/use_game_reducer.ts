import { WordValidationStateEnum } from '~/features/game/enums/word_validation_state'
import { GameState, GameStateEnum } from '#features/game_session/enums/game_state'
import { SessionState } from '#features/game_session/enums/session_state'
import { WordStateProps } from '~/features/game/use_game'
import { useReducer } from 'react'

interface GameReducerState {
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

const initialState: GameReducerState = {
  wordToGuess: null,
  wordState: { valid: false, status: WordValidationStateEnum.INVALID },
  hintGiverWords: [],
  guesserWords: [],
  gameState: GameState.WAITING,
  turnState: null,
  opponent: null,
}

const gameReducer = (state: GameReducerState, action: GameAction): GameReducerState => {
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

export const useGameReducer = () => {
  return useReducer(gameReducer, initialState)
}
