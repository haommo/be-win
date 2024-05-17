import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Manifest from 'App/Models/Manifest'  // Ensure this path matches the location of your Manifest model


export default class ManifestHistory extends BaseModel {
  public static table = 'manifest_histories'  // Make sure the table name is correctly defined

  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string;

  @column()
  public manifest_id: string;

  @belongsTo(() => Manifest, {
    foreignKey: 'manifest_id',  // 'manifest_id' in ManifestHistory links to 'manifest_id' in Manifest
    localKey: 'manifest_id'    // Assuming 'manifest_id' is a unique identifier in the Manifest model
  })
  public manifest: BelongsTo<typeof Manifest>

  @column()
  public date: Date;

  @column()
  public flight: string;

  @column()
  public detail: string;
  
  @column()
  public location: string;

  @column()
  public manifest_status: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
