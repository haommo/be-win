import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'shipments'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('manifest_id', 180).references('manifest_id').inTable('manifest_shipments').onDelete('CASCADE')
      table.text('shipment_content').nullable()
      table.text('localcode').nullable()
      table.text('localtracking').nullable()

    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('manifest_id')
      table.dropColumn('shipment_content')
      table.dropColumn('localcode')
      table.dropColumn('localtracking')
    })
  }
}

