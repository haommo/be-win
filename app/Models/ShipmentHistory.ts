import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo, afterSave } from '@ioc:Adonis/Lucid/Orm'
import Shipment from 'App/Models/Shipment'  // Ensure this path matches the location of your Shipment model
import Event from '@ioc:Adonis/Core/Event'


export default class ShipmentHistory extends BaseModel {
  public static table = 'shipment_histories'

  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string;

  @column()
  public hawb: string;

  @belongsTo(() => Shipment, {
    foreignKey: 'hawb',  // 'hawb' in ShipmentHistory links to 'hawb' in Shipment
  })
  public shipment: BelongsTo<typeof Shipment>

  @column()
  public date: Date;

  @column()
  public status: string;

  @column()
  public detail: string;

  @column()
  public location: string;

  @column()
  public event_id: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterSave()
  public static async updateShipmentStatus(history: ShipmentHistory) {
    const latestHistory = await ShipmentHistory.query()
      .where('hawb', history.hawb)
      .orderBy('date', 'desc')
      .first();

    if (latestHistory) {
      const shipment = await Shipment.query()
        .where('hawb', history.hawb)
        .first();
    
      if (shipment && shipment.status !== latestHistory.status) {
        shipment.status = latestHistory.status;
        await shipment.save();
      }
    }
  }

}
