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
const LoginController = () => import('#controllers/login_controller')

// region Controller's Imports
const HomeController = () => import('#controllers/home_controller')
const AuthController = () => import('#controllers/auth_controller')
const GameController = () => import('#controllers/game_controller')
const ChatController = () => import('#controllers/chat_controller')
// endregion

router.get('/', [HomeController, 'handle']).as('home')
router.get('/login', [LoginController, 'handle']).as('login')
router.get('/game', [GameController, 'handle']).as('game').use(middleware.auth())

router.get('/auth/:provider/redirect', [AuthController, 'redirect']).where('provider', /twitch/)
router.get('/auth/:provider/callback', [AuthController, 'callback']).where('provider', /twitch/)

router.post('/chat', [ChatController, 'store']).as('chat.store').use(middleware.auth())
