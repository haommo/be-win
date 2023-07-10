import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'shipment_package_infos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('uuid').notNullable().unique()
      table.string('hawb').references('hawb').inTable('shipments').onDelete('CASCADE')
      table.integer('quantity', 180).notNullable()
      table.string('type', 180).notNullable()
      table.integer('length', 180).notNullable()
      table.integer('width', 180).notNullable()
      table.integer('height', 180).notNullable()
      table.integer('weight', 180).notNullable()
      table.integer('subweight', 180).notNullable()
      table.integer('subvolume', 180).notNullable()
      table.integer('subcharge', 180).notNullable()
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
