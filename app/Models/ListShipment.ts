import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ListShipment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string;

  @column()
  public manifest_id: string;

  @column()
  public hawb: number; 

  @column()
  public receiver_name: string; 

  @column()
  public gross_weight: string; 

  @column()
  public volume_weight: string; 

  @column()
  public charge_weight: number; 

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
