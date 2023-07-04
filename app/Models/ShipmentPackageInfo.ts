import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ShipmentPackageInfo extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string;

  @column()
  public hawb: string;

  @column()
  public quantity: number;

  @column()
  public type: string;

  @column()
  public length: number;

  @column()
  public width: number;

  @column()
  public height: number;

  @column()
  public weight: number;

  @column()
  public subweight: number;
  
  @column()
  public subvolume: number;

  @column()
  public subcharge: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
