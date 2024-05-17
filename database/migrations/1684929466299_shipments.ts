import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'shipments'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('hawb').notNullable().unique() 
      table.string('created_by', 180).references('uuid').inTable('users').onDelete('CASCADE')
      table.string('created_for', 180).references('uuid').inTable('users').onDelete('CASCADE')
      table.string('status', 180).nullable()
      table.string('shipment_method', 180).notNullable()
      table.string('shipment_type', 180).notNullable()
      table.string('service_id', 180).references('uuid').inTable('services').onDelete('CASCADE')
      table.string('reason_export', 255).notNullable()
      table.json('sender_address').notNullable()
      table.json('receiver_address').notNullable()
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
