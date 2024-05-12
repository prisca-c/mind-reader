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
const LoginController = () => import('#controllers/pages/login_controller')
const HomeController = () => import('#controllers/pages/home_controller')
const AuthController = () => import('#controllers/auth_controller')
const GameController = () => import('#controllers/pages/game_controller')
const ChatController = () => import('#controllers/chat_controller')
// endregion

router.get('/', [HomeController, 'render']).as('home')
router.get('/login', [LoginController, 'render']).as('login')
router.get('/game', [GameController, 'render']).as('game').use(middleware.auth())

router.get('/auth/:provider/redirect', [AuthController, 'redirect']).where('provider', /twitch/)
router.get('/auth/:provider/callback', [AuthController, 'callback']).where('provider', /twitch/)

router.post('/chat', [ChatController, 'store']).as('chat.store').use(middleware.auth())
