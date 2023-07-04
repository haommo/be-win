import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ShipmentProductInfo extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string;

  @column()
  public hawb: string;

  @column()
  public name: string;

  @column()
  public description: string;

  @column()
  public type: string;

  @column()
  public quantity: number;
  
  @column()
  public price: number;
  
  @column()
  public amount: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
