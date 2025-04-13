import Feature from "#models/feature";
import { createFeatureValidator } from "#validators/feature";
import { Infer } from "@vinejs/vine/types";
import { PostgisUtils } from "./postgis_service.js";
import { GeometryType } from "../types/postgisTypes.js";

export class FeatureService {
  async all() {
    return await Feature.all();
  };

  async create(payload: Infer<typeof createFeatureValidator>) {
    const { name, geometry, layer_id } = payload;

    const geometryParsed = JSON.parse(geometry);

    if (!PostgisUtils.isValidGeoJson(geometryParsed)) {
      throw new Error('Invalid GeoJSON');
    }

    const geom = await PostgisUtils.geoJsonToPostgis(geometryParsed);
    const geomType = PostgisUtils.getGeometryType(geometryParsed);

    const feature = new Feature();
    feature.name = name ?? null;
    feature.geometry = geom;
    feature.geometryType = geomType as GeometryType;
    feature.layerId = layer_id;

    await feature.save();
    return feature;
  }

  async show(id: number) {
    return await Feature.findOrFail(id);
  }

  async delete(id: number) {
    await Feature.query().where('id', id).delete();
  }
}
