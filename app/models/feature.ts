import { DateTime } from 'luxon'
import Layer from "#models/layer"
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { GeometryType } from '../types/postgisTypes.js'

export default class Feature extends BaseModel {

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare geometry: string

  @column()
  declare geometryType: GeometryType

  @column()
  declare layerId: number

  @belongsTo(() => Layer)
  declare layer: BelongsTo<typeof Layer>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
