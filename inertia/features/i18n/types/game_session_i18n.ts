export interface GameSessionI18N {
  title: string
  errors: {
    invalidWord: string
    invalidTurn: string
  }
  buttons: {
    submit: string
    backToMenu: string
  }
  player: string
  hint: string
  guess: string
}
