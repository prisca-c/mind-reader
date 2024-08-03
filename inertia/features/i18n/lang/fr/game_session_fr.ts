import type { GameSessionI18N } from '~/features/i18n/types/game_session_i18n'

export const gameSessionFR: GameSessionI18N = {
  title: 'Jeu',
  errors: {
    invalidWord: 'Mot invalide',
    invalidTurn: "Ce n'est pas ton tour",
  },
  buttons: {
    submit: 'Deviner le mot',
    backToMenu: 'Retour au menu',
  },
  player: 'Joueur',
  hint: 'Indice',
  guess: 'Réponse',
}
