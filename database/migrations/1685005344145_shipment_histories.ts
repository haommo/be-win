import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'shipment_histories'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('uuid').nullable().unique()
      table.string('hawb').references('hawb').inTable('shipments').onDelete('CASCADE')
      table.date('date').nullable()
      table.string('status').nullable()
      table.string('detail', 180).nullable()
      table.string('location', 180).nullable()
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
