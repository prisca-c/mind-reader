import type { GameSessionI18N } from '~/features/i18n/types/game_session_i18n'

export const gameSessionEN: GameSessionI18N = {
  title: 'Session',
  errors: {
    invalidWord: 'Invalid word',
    invalidTurn: "It's not your turn",
  },
  buttons: {
    submit: 'Guess word',
    backToMenu: 'Back to menu',
  },
  player: 'Player',
  hint: 'Hint',
  guess: 'Guess',
}
