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
  async show({ params }: HttpContext) {
    return this.userService.find(params.id);
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) { }

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
  async destroy({ params }: HttpContext) { }
}
