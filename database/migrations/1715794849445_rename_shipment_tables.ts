import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RenameShipmentTables extends BaseSchema {
  public async up() {
    // First rename 'list_shipments' to a temporary name
    this.schema.renameTable('list_shipments', 'temporary_shipments')

    // Then rename 'manifest_shipments' to 'manifest'
    this.schema.renameTable('manifest_shipments', 'manifest')

    // Finally, rename 'temporary_shipments' to 'manifest_shipments'
    this.schema.renameTable('temporary_shipments', 'manifest_shipments')
  }

  public async down() {
    // Reverse the process in the exact opposite order
    this.schema.renameTable('manifest_shipments', 'temporary_shipments')
    this.schema.renameTable('manifest', 'manifest_shipments')
    this.schema.renameTable('temporary_shipments', 'list_shipments')
  }
}
