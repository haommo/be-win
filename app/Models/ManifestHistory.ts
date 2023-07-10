import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ManifestHistory extends BaseModel {

  protected tableName = 'shipment_histories'


  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string;

  @column()
  public manifest_id: number;

  @column()
  public date: Date;

  @column()
  public flight: string;

  @column()
  public detail: string;
  
  @column()
  public location: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
