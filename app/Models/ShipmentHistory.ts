import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Shipment from 'App/Models/Shipment'  // Ensure this path matches the location of your Shipment model


export default class ShipmentHistory extends BaseModel {
  public static table = 'shipment_histories'

  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string;

  @column()
  public hawb: string;

  @belongsTo(() => Shipment, {
    foreignKey: 'hawb',  // 'hawb' in ShipmentHistory links to 'hawb' in Shipment
  })
  public shipment: BelongsTo<typeof Shipment>

  @column()
  public date: Date;

  @column()
  public status: string;

  @column()
  public detail: string;

  @column()
  public location: string;

  @column()
  public event_id: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
