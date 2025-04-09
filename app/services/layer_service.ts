import Layer from "#models/layer";
import { createLayerValidator } from "#validators/layer";
import { Infer } from "@vinejs/vine/types";

export class LayerService {
  async all() {
    return await Layer.all();
  };

  async create(payload: Infer<typeof createLayerValidator>) {
    const layer = new Layer();
    layer.name = payload.name;
    layer.description = payload.description ?? null;
    layer.zIndex = payload.z_index ?? null;
    layer.isActive = payload.is_active ?? true;
    layer.userId = payload.user_id;
    await layer.save();
    return layer;
  }


  async countByUserId(userId: number) {
    const count = await Layer.query().where('user_id', userId).count('* as count');
    if (!count[0].$extras.count) {
      return 0;
    } else {
      return count[0].$extras.count;
    }
  }
}
