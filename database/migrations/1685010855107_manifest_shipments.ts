import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'manifest_shipments'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('manifest_id').notNullable().unique()
      table.string('created_by', 180).references('uuid').inTable('users').onDelete('CASCADE')
      table.date('date').notNullable()
      table.string('airway_bill_number', 180).notNullable()
      table.string('airline', 180).notNullable()
      table.string('country', 180).notNullable()
      table.string('status', 180).notNullable()
      table.string('total_hawb', 180).notNullable()
      table.string('total_gross_weight', 180).notNullable()
      table.string('total_charge_weight', 180).notNullable()
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
