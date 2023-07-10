import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string;
  @column()
  public created_by: string;
  @column()
  public post_title: string;
  @column()
  public content: string;
  @column()
  public publish: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
