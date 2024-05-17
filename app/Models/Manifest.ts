import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User' // Adjust the import path as needed
import ManifestHistory from 'App/Models/ManifestHistory'
import ManifestShipment from 'App/Models/ManifestShipment'

export default class Manifest extends BaseModel {
  public static table = 'manifests'

  @column({ isPrimary: true })
  public id: number

  @column()
  public manifest_id: string;
  
  @column()
  public created_by: string;
  
  @belongsTo(() => User, {
    foreignKey: 'created_by', // 'created_by' is the foreign key in this Manifest model
    localKey: 'uuid'         // 'uuid' is the reference key in the User model
  })
  
  public creator: BelongsTo<typeof User>

  @column()
  public date: Date;

  @column()
  public airway_bill_number: string; 

  @column()
  public airline: string;

  @column()
  public country: string; 

  @column()
  public status: string;  

  @column()
  public total_hawb: string; 

  @column()
  public total_gross_weight: string; 

  @column()
  public total_charge_weight: string;
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => ManifestHistory, {
    foreignKey: 'manifest_id', // 'created_by' is the foreign key in this Manifest model
    localKey: 'manifest_id'   
  })
  public histories: HasMany<typeof ManifestHistory>

  @hasMany(() => ManifestShipment, {
    foreignKey: 'manifest_id', // 'created_by' is the foreign key in this Manifest model
    localKey: 'manifest_id'
  })
  public shipments: HasMany<typeof ManifestShipment>
}
