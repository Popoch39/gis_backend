import { createLayerValidator } from '#validators/layer';
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core';
import { LayerService } from '#services/layer_service';


@inject()
export default class LayersController {

  constructor(
    private layerSerice: LayerService
  ) { }
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const layers = await this.layerSerice.all();
    return response.ok({ layers });
  }

  /**
   * Handle form submission for the create action
   */
  async store({ auth, request, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized({ message: 'Unauthorized' });
    }
    const layerCount = await this.layerSerice.countByUserId(auth.user.id);
    const data = {
      ...request.body(),
      user_id: auth.user.id,
      z_index: layerCount
    }
    const payload = await request.validateUsing(createLayerValidator, { data });
    const layer = await this.layerSerice.create(payload);
    return response.ok({ layer });
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const layer = await this.layerSerice.show(params.id);
    return response.ok({ layer });
  }

  /**
   * Edit individual record
   */
  async edit() { }
}
