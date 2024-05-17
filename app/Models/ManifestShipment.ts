import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Manifest from 'App/Models/Manifest'  // Ensure this path matches the location of your Manifest model



export default class ManifestShipment extends BaseModel {
  public static table = 'manifest_shipments'

  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string;

  @column()
  public manifest_id: string;

  @belongsTo(() => Manifest, {
    foreignKey: 'manifest_id',  // This is the foreign key in ManifestShipment that links to Manifest
    localKey: 'manifest_id'    // This should be the key in Manifest that manifest_id references
  })
  public manifest: BelongsTo<typeof Manifest>

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
