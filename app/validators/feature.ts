import vine from '@vinejs/vine'
import { GeometryType } from '../types/postgisTypes.js'

export const createFeatureValidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
    geometry: vine.string(),
    layer_id: vine.number()
  })
)
