import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { UserService } from '#services/user_service'
import { createUserValidator, loginValidator } from '#validators/user';
import User from '#models/user';

@inject()
export default class AuthController {

  constructor(private userService: UserService) { };

  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator);
    const user = await this.userService.create(payload);
    const token = await User.accessTokens.create(user);
    console.log(user);
    return response.ok({
      token: token,
      user: user
    })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password);
    const token = await User.accessTokens.create(user);
    return response.ok({
      token: token,
      user: user
    })
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail();
    const token = auth.user?.currentAccessToken.identifier;
    if (!token) {
      return response.badRequest({ message: 'Token not found' });
    }
    await User.accessTokens.delete(user, token);
    return response.ok({ message: 'Logout successful' });
  }

}
