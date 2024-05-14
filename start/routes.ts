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
const AuthController = () => import('#controllers/auth_controller')
const PagesController = () => import('#controllers/pages_controller')
const ChatController = () => import('#controllers/chat_controller')
// endregion

router.get('/', [PagesController, 'home']).as('home')
router.get('/login', [PagesController, 'login']).as('login')
router
  .group(() => {
    router.post('/chat', [ChatController, 'store']).as('chat.store')
    router.get('/game', [PagesController, 'game']).as('game')
    router.get('/game/search', [PagesController, 'search']).as('search')
  })
  .use(middleware.auth())

router.get('/auth/:provider/redirect', [AuthController, 'redirect']).where('provider', /twitch/)
router.get('/auth/:provider/callback', [AuthController, 'callback']).where('provider', /twitch/)
