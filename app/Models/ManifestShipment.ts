import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ManifestShipment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public manifest_id: string;
  
  @column()
  public created_by: string;
  
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
  public total_HAWB: string; 

  @column()
  public total_gross_weight: string; 

  @column()
  public total_charge_weight: string;
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  
}


