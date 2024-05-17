// path/filename: /database/migrations/XXXX_add_event_id_to_shipment_histories.ts
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddEventIdToShipmentHistories extends BaseSchema {
  protected tableName = 'shipment_histories'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('event_id').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('event_id')
    })
  }
}
