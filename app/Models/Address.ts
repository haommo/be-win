import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User' // Ensure this path matches the location of your User model

export default class Address extends BaseModel {
  public static table = 'addresses'

  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public created_by: string

  @belongsTo(() => User, {
    foreignKey: 'created_by', // 'created_by' is the foreign key in Address model
    localKey: 'uuid'         // 'uuid' is the reference key in the User model
  })
  public creator: BelongsTo<typeof User>

  @column()
  public name: string

  @column()
  public company: string

  @column()
  public number: string

  @column()
  public email: string

  @column()
  public country: string

  @column()
  public address_first: string

  @column()
  public address_second: string

  @column()
  public city: string

  @column()
  public state: string

  @column()
  public zip: string

  @column()
  public type: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
