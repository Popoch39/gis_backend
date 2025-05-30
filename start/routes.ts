/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')
const LayersController = () => import('#controllers/layers_controller')
const FeaturesController = () => import('#controllers/features_controller')



router.post('/auth/register', [AuthController, 'register'])
router.post('/auth/login', [AuthController, 'login'])
router.post('/auth/logout', [AuthController, 'logout']).use(middleware.auth())


router.group(() => {

  // USERS
  router.resource('users', UsersController);

  // LAYERS
  router.resource('layers', LayersController);

  router.resource('features', FeaturesController);

}).middleware(middleware.auth())
