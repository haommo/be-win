import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'services'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('uuid').notNullable().unique()
      table.string('created_by', 180).references('uuid').inTable('users').onDelete('CASCADE')
      table.string('name', 180).notNullable()
      table.text('description').notNullable()
      table.string('image').notNullable()
      table.boolean('active').notNullable().defaultTo(0)
      table.timestamps(true, true)

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
