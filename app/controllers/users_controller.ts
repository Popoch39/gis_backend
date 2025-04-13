
import { createUserValidator, updateUserValidator } from '#validators/user';
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { UserService } from '#services/user_service';

@inject()
export default class UsersController {

  constructor(private userService: UserService) { }
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const users = await this.userService.all();
    return response.ok({ users });
  }

  /**
   * Display form to create a new record
   */
  async create({ }: HttpContext) { }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator);
    const user = await this.userService.create(payload);
    return response.ok({ user });
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const user = await this.userService.find(params.id)
    return response.ok({ user });
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const payload = await request.validateUsing(updateUserValidator);
    return this.userService.update(params.id, payload);
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    await this.userService.delete(params.id);
    return response.ok({ message: 'User deleted' });
  }
}
