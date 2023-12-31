import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string;
  @column()
  public created_by: string;
  @column()
  public name: string;
  @column()
  public description: string;
  @column()
  public image: string
   @column()
  public active: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
