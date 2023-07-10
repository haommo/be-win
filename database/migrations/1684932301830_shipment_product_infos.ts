import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'shipment_product_infos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('uuid').notNullable().unique()
      table.string('hawb').references('hawb').inTable('shipments').onDelete('CASCADE')
      table.string('name', 180).notNullable()
      table.text('description').notNullable()
      table.string('type', 180).notNullable()
      table.integer('quantity', 180).notNullable()
      table.integer('price', 180).notNullable()
      table.integer('amount', 180).notNullable()
      table.timestamps(true, true)

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
