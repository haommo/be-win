import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User' // Adjust the import path based on your project structure
import { DateTime } from 'luxon'

export default class Service extends BaseModel {
  public static table = 'services' // Set your actual table name here

  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public created_by: string

  @belongsTo(() => User, {
    foreignKey: 'created_by', // 'created_by' is the foreign key in this model
    localKey: 'uuid'         // 'uuid' is the referenced key in the User model
  })
  public creator: BelongsTo<typeof User>

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public image: string

  @column()
  public active: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

