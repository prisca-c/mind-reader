export interface LangResources {
  global: {
    hintGiver: string
    guesser: string
    you: string
  }

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
      profile: string
    }
    points: string
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
    gameState: {
      playing: string
      waiting: string
      win: string
      lose: string
    }
    player: string
    hint: string
    guess: string
    opponent: string
  }

  profile: {
    title: string
    gameHistory: string
    buttons: {
      home: string
    }
    game: {
      date: string
      role: string
      opponent: string
      word: string
      wordsList: string
    }
  }
}
