import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany  } from '@ioc:Adonis/Lucid/Orm'
import Service from "App/Models/Service";
import Shipment from './Shipment';
import Manifest from './Manifest';

export default class User extends BaseModel {
  public static table = 'users'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public number: string

  @column()
  public country: string

  @column()
  public state: string

  @column()
  public city: string

  @column()
  public address: string

  @column()
  public zip: string

  @column()
  public company: string

  @column()
  public role: string

  @column()
  public uuid: string

  @column()
  public status: boolean

  @column()
  public email_verify: boolean

  @column()
  public image: string

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Service, {
    foreignKey: 'created_by',
    localKey: 'uuid'
  })
  public service: HasMany<typeof Service>;
  
  @hasMany(() => Shipment, {
    foreignKey: 'created_by',
    localKey: 'uuid'
  })
  public shipment: HasMany<typeof Shipment>;
  
  @hasMany(() => Manifest, {
    foreignKey: 'created_by',
    localKey: 'uuid'
  })
  public manifest: HasMany<typeof Manifest>;

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
