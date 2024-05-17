import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RenameManifestToManifests extends BaseSchema {
  public async up() {
    this.schema.renameTable('manifest', 'manifests')
  }

  public async down() {
    this.schema.renameTable('manifests', 'manifest')
  }
}
