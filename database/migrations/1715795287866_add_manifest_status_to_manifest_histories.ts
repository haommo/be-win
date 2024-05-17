import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddManifestStatusToManifestHistories extends BaseSchema {
  protected tableName = 'manifest_histories'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Add a new 'manifest_status' column
      table.string('manifest_status', 255)
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Remove the 'manifest_status' column
      table.dropColumn('manifest_status')
    })
  }
}
