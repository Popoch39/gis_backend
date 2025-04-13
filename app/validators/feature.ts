import vine from '@vinejs/vine'

export enum featureType {
  POINT = 'POINT',
  LINESTRING = 'LINESTRING',
  POLYGON = 'POLYGON'
}

export const createFeatureValidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
    geometry: vine.string(),
    geometry_type: vine.enum(featureType),
    layer_id: vine.number()
  })
)
