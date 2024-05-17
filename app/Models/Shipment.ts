import { DateTime } from "luxon";
import { BaseModel, column, BelongsTo, belongsTo, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import User from "App/Models/User";
import Service from "App/Models/Service";
import ShipmentHistory from "App/Models/ShipmentHistory";
import ShipmentPackageInfo from "App/Models/ShipmentPackageInfo";
import ShipmentProductInfo from "App/Models/ShipmentProductInfo";
import ManifestShipment from "App/Models/ManifestShipment";
//import Logger from '@ioc:Adonis/Core/Logger';
//import transporter from 'App/Services/MailService'

export default class Shipment extends BaseModel {
  public static table = 'shipments'
  
  @column({ isPrimary: true })
  public id: number;

  @column()
  public hawb: string;

  @column()
  public created_by: string;

  @column()
  public created_for: string;

  @belongsTo(() => User, {
    foreignKey: 'created_by', 
    localKey: 'uuid'
  })
  public createdBy: BelongsTo<typeof User>;

  @belongsTo(() => User, {
    foreignKey: 'created_for', 
    localKey: 'uuid'
  })
  public user: BelongsTo<typeof User>;

  @belongsTo(() => Service, {
    foreignKey: 'service_id', 
    localKey: 'uuid'
  })
  public service: BelongsTo<typeof Service>;

  @column()
  public status: string;

  @column()
  public shipment_method: string;

  @column()
  public shipment_type: string;

  @column()
  public reason_export: string;

  @column()
  public service_id: string;

  @column()
  public sender_address: JSON;

  @column()
  public receiver_address: JSON;

  @column()
  public shipment_content: string;

  @column()
  public local_code: string;

  @column()
  public local_tracking: string;
  
  @hasMany(() => ShipmentHistory, {
    foreignKey: 'hawb',
    localKey: 'hawb'
  })
  public histories: HasMany<typeof ShipmentHistory>;

  @hasMany(() => ShipmentPackageInfo, {
    foreignKey: 'hawb',
    localKey: 'hawb'
  })
  public packageInfos: HasMany<typeof ShipmentPackageInfo>;

  @hasMany(() => ShipmentProductInfo, {
    foreignKey: 'hawb',
    localKey: 'hawb'
  })
  public productInfos: HasMany<typeof ShipmentProductInfo>;

  @hasMany(() => ManifestShipment, {
    foreignKey: 'hawb',
    localKey: 'hawb'
  })
  public manifestShipments: HasMany<typeof ManifestShipment>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;


}
