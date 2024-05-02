/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')

router.on('/').renderInertia('home', { version: 6 })

router.get('/auth/:provider/redirect', [AuthController, 'redirect']).where('provider', /twitch/)
router.get('/auth/:provider/callback', [AuthController, 'callback']).where('provider', /twitch/)
