import { createFeatureValidator } from '#validators/feature';
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core';
import { FeatureService } from '#services/feature_service';

@inject()
export default class FeaturesController {
  constructor(
    private featureService: FeatureService
  ) { }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createFeatureValidator);
    const feature = await this.featureService.create(payload);
    return response.ok({ feature });
  }
}

