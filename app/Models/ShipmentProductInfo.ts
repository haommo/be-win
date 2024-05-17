import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Shipment from 'App/Models/Shipment'  // Make sure this path matches the location of your Shipment model

export default class ShipmentProductInfo extends BaseModel {
  public static table = 'shipment_product_infos'

  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string;

  @column()
  public hawb: string;

  @belongsTo(() => Shipment, {
    foreignKey: 'hawb',  // 'hawb' in ShipmentProductInfo links to 'hawb' in Shipment
  })
  public shipment: BelongsTo<typeof Shipment>

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
