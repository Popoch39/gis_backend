import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'features'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').nullable()
      table.geometry('geometry').notNullable()
      table.string('geometry_type').notNullable()
      table.integer('layer_id').unsigned().references('id').inTable('layers').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })


    // SRID 4326 for geo col
    this.raw(`
      ALTER TABLE features
      ALTER COLUMN geometry TYPE geometry(Geometry, 4326)
      USING ST_SetSRID(geometry, 4326)
    `)

    this.schema.raw(`
      CREATE INDEX features_geometry_idx
      ON features
      USING GIST (geometry)
    `)
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
