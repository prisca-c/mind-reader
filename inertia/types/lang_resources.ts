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
      wordInvalid: string
      empty: string
      manyWords: string
      invalidCharacter: string
      invalidTurn: string
      matches: string
    }
    buttons: {
      submit: {
        guesser: string
        hintGiver: string
      }
      backToMenu: string
    }
    player: string
    hint: string
    guess: string
  }
}
