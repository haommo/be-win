import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UpdateShipmentsTable extends BaseSchema {
  protected tableName = 'shipments'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      // Rename columns
      table.renameColumn('localcode', 'local_code')
      table.renameColumn('localtracking', 'local_tracking')

      // Add an index to the 'hawb' column
      table.index('hawb', 'shipments_hawb_index') // Naming the index is optional but recommended for clarity
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      // Revert column renames
      table.renameColumn('local_code', 'localcode')
      table.renameColumn('local_tracking', 'localtracking')

      // Remove the index from the 'hawb' column
      table.dropIndex('hawb', 'shipments_hawb_index')
    })
  }
}
