// app/Controllers/Http/WebhookController.ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import ShipmentHistory from 'App/Models/ShipmentHistory'

export default class WebhookController {
  public async store({ request, response }: HttpContextContract) {
    const payload = request.body();

    if (payload.event !== "TRACKING_UPDATED" || !payload.data) {
      return response.status(400).json({ message: 'Invalid event data' });
    }

    const tag = payload.data.tag;
    const providersHash = payload.data.track_info.tracking.providers_hash.toString();
    const events = payload.data.track_info.tracking.providers[0].events;

    try {
      const trx = await Database.transaction();

      try {
        await ShipmentHistory
          .query({ client: trx })
          .where('hawb', tag)
          .andWhereNotNull('event_id')
          .delete();

        for (const event of events) {
          const statusParts = event.sub_status.split('_');
          const formattedStatus = statusParts.length > 0 ? statusParts[0].toLowerCase() : 'intransit';

          const newHistory = new ShipmentHistory();
          newHistory.fill({
            event_id: providersHash,
            hawb: tag,
            date: new Date(event.time_utc),
            status: formattedStatus || 'intransit',  // Set to 'intransit' if null or empty
            detail: event.description,
            location: event.location
          });

          await newHistory.useTransaction(trx).save();
        }

        await trx.commit();
        return response.json({ message: 'Data added successfully' });
      } catch (error) {
        await trx.rollback();
        throw error;
      }
    } catch (error) {
      console.error('Error processing webhook data:', error);
      return response.status(500).json({ message: 'Failed to process data', error: error.message });
    }
  }
}
