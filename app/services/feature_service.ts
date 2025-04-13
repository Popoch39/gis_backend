import Feature from "#models/feature";
import { createFeatureValidator } from "#validators/feature";
import { Infer } from "@vinejs/vine/types";

export class FeatureService {
  async all() {
    return await Feature.all();
  };

  async create(payload: Infer<typeof createFeatureValidator>) {
    const feature = new Feature();

    return feature;
  }
}
