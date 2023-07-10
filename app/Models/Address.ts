import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string;
  @column()
  public created_by: string;
  @column()
  public name: string;
  @column()
  public company: string;
  @column()
  public number: string;
  @column()
  public email: string;
  @column()
  public country: string;
  @column()
  public address_first: string;
  @column()
  public address_second: string;
  @column()
  public city: string;
  @column()
  public state: string;
  @column()
  public zip: string;
  @column()
  public type: string;



  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
