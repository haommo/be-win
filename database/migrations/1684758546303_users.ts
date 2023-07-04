import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 180).notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('number', 180).nullable()
      table.string('country', 180).nullable()
      table.string('state', 180).nullable()
      table.string('city', 180).nullable()
      table.text('address').nullable()
      table.string('zip', 180).nullable()
      table.string('company', 180).nullable()
      table.string('role', 180).nullable()
      table.string('uuid').nullable().unique()
      table.boolean('status').nullable().defaultTo(0)
      table.boolean('email_verify').nullable().defaultTo(0)
      table.string('image').nullable()
      table.string('remember_me_token').nullable()

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
