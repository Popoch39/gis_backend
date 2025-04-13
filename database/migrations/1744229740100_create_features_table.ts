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
