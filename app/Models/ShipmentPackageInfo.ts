import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Shipment from 'App/Models/Shipment'  // Ensure this path matches the location of your Shipment model

export default class ShipmentPackageInfo extends BaseModel {
  public static table = 'shipment_package_infos'

  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string;

  @column()
  public hawb: string;

  @belongsTo(() => Shipment, {
    foreignKey: 'hawb',  // 'hawb' in ShipmentPackageInfo links to 'hawb' in Shipment
  })
  public shipment: BelongsTo<typeof Shipment>

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
