import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('uuid').nullable().unique()
      table.string('created_by', 180).references('uuid').inTable('users').onDelete('CASCADE')
      table.string('name', 180).notNullable()
      table.string('company', 180).nullable()
      table.string('number', 180).notNullable()
      table.string('email', 255).nullable()
      table.string('country', 180).notNullable()
      table.text('address_first').notNullable()
      table.text('address_second').nullable()
      table.string('city', 180).nullable()
      table.string('state', 180).nullable()
      table.string('zip', 180).nullable()
      table.string('type', 180).nullable()
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
