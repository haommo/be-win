import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Shipment extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public hawb: string;

  @column()
  public created_by: number;

  @column()
  public status: string;

  @column()
  public created_for:number

  @column()
  public shipment_method: string;

  @column()
  public shipment_type: string;

  @column()
  public reason_export: string;

  @column()
  public service_id: number;

  @column()
  public sender_address: string;

  @column()
  public receiver_address: string;

  @column()
  public shipment_content: string;

  @column()
  public localcode: string;

  @column()
  public localtracking: string;
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
