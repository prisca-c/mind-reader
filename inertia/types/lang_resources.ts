export interface LangResources {
  landingPage: {
    title: string
    description: string
    buttons: {
      login: string
    }
  }

  login: {
    title: string
    description: string
    buttons: {
      twitch: string
    }
  }

  home: {
    title: string
    description: string
    buttons: {
      start: string
    }
  }

  gameSession: {
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
}
