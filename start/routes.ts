/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// region Controller's Imports
const AuthCallbackController = () => import('#features/auth/controllers/auth_callback_controller')
const AuthRedirectController = () => import('#features/auth/controllers/auth_redirect_controller')
const ChatController = () => import('#features/chat/controllers/chat_controller')
const GameSessionController = () => import('#features/pages/controllers/game_session_controller')
const SearchGameController = () => import('#features/pages/controllers/search_game_controller')
const HomeController = () => import('#features/pages/controllers/home_controller')
const LandingPageController = () => import('#features/pages/controllers/landing_page_controller')
const LoginController = () => import('#features/pages/controllers/login_controller')
const GameAnswerController = () => import('#features/game_session/controllers/game_answer_controller')
const SearchMatchmakingController = () => import('#features/matchmaking/controllers/search_matchmaking_controller')
const CancelMatchmakingController = () => import('#features/matchmaking/controllers/cancel_matchmaking_controller')
const AcceptMatchmakingController = () => import('#features/matchmaking/controllers/accept_matchmaking_controller')
const GameReadyController = () => import('#features/game_session/controllers/game_ready_controller')
const ProfileController = () => import('#features/pages/controllers/profile_controller')
// endregion

router.get('/', [LandingPageController, 'render']).as('home')
router.get('/login', [LoginController, 'render']).as('login')
router
  .group(() => {
    router.post('/chat', [ChatController, 'store']).as('chat.store')
    router.get('/game', [HomeController, 'render']).as('game')

    router.get('/game/search', [SearchGameController, 'render']).as('search')
    router.post('/game/search', [SearchMatchmakingController, 'handle']).as('game.searchingQueue')
    router.delete('/game/search', [CancelMatchmakingController, 'handle']).as('game.cancelQueue')
    router
      .get('/game/session/:sessionId/accept', [AcceptMatchmakingController, 'handle'])
      .as('game.handleAccept')
      .where('sessionId', router.matchers.uuid())
    router
      .get('/game/session/:sessionId/ready', [GameReadyController, 'handle'])
      .as('game.handleReady')
      .where('sessionId', router.matchers.uuid())

    router
      .get('/game/session/:sessionId', [GameSessionController, 'render'])
      .as('game.session')
      .where('sessionId', router.matchers.uuid())
    router
      .post('/game/session/:sessionId/answer', [GameAnswerController, 'handle'])
      .as('game.handleAnswer')
      .where('sessionId', router.matchers.uuid())

    router.get('/profile', [ProfileController, 'render']).as('profile')
  })
  .use(middleware.auth())

router.get('/auth/:provider/redirect', [AuthRedirectController, 'handle']).where('provider', /twitch/)
router.get('/auth/:provider/callback', [AuthCallbackController, 'handle']).where('provider', /twitch/)
