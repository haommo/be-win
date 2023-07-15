import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ShipmentTracking extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string;

  @column()
  public hawb: string;

  @column()
  public carrierCode: string;

  @column()
  public trackingNumber: string;

  @column()
  public date: Date;

  @column()
  public status: string;

  @column()
  public detail: string;

  @column()
  public location: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
