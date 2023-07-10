import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'list_shipments'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('uuid').notNullable().unique()
      table.string('manifest_id').references('manifest_id').inTable('manifest_shipments').onDelete('CASCADE')
      table.string('hawb').references('hawb').inTable('shipments').onDelete('CASCADE')
      table.string('receiver_name', 180).notNullable()
      table.string('gross_weight', 180).notNullable()
      table.string('volume_weight', 180).notNullable()
      table.integer('charge_weight', 180).notNullable()

      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
