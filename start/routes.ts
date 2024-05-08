/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const LoginController = () => import('#controllers/login_controller')

// region Controller's Imports
const HomeController = () => import('#controllers/home_controller')
const AuthController = () => import('#controllers/auth_controller')
const GameController = () => import('#controllers/game_controller')
// endregion

router.get('/', [HomeController, 'handle']).as('home')
router.get('/login', [LoginController, 'handle']).as('login')
router.get('/game', [GameController, 'handle']).as('game')

router.get('/auth/:provider/redirect', [AuthController, 'redirect']).where('provider', /twitch/)
router.get('/auth/:provider/callback', [AuthController, 'callback']).where('provider', /twitch/)
