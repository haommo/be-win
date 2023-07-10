// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Notification from "App/Models/Notification";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
const { v1: uuidv1 } = require("uuid");
import Database from "@ioc:Adonis/Lucid/Database";


export default class NotificationsController {

    public async index({ response }) {
        const notifications = await Notification.all();
    
        return response.ok(notifications);
      }
    
      public async store({ auth, request, response }) {
        
        const notificationSchema = schema.create({
            post_title: schema.string({ trim: true }, [rules.maxLength(255)]),
            content: schema.string({ trim: true }, [rules.maxLength(255)]),
    
        });
        
    
        const payload: any = await request.validate({ schema: notificationSchema });
        payload.publish =  request.input('publish');
        payload.uuid = uuidv1();
        payload.created_by = auth.user.uuid;
        const notification: Notification = await Notification.create(payload);
    
        return response.ok(notification);
      }
    
      public async show({ params, response }) {
        const notification_id = await Database.from("notifications")
        .where("uuid", params.id)
        .first();     
        const notification: any = await Notification.find(notification_id.id);
        if (!notification) {
          return response.notFound({ message: "notification not found" });
        }
    
        return response.ok(notification);
      }
    
      public async update({ request, params, response }) {
        const notificationSchema = schema.create({
            post_title: schema.string({ trim: true }, [rules.maxLength(255)]),
            content: schema.string({ trim: true }, [rules.maxLength(255)]),
        });
        
    
        const payload: any = await request.validate({ schema: notificationSchema });
        payload.publish =  request.input('publish');
    
    
        const notification_id = await Database.from("notifications")
        .where("uuid", params.id)
        .first();     
        const notification: any = await Notification.find(notification_id.id);
        if (!notification) {
          return response.notFound({ message: "Notification not found" });
        }
    
        notification.post_title = payload.post_title;
        notification.content = payload.content;
        notification.publish = payload.publish;
    
        await notification.save();
    
        return response.ok({ message: "Notification successfully update", notification });
      }
    
      public async destroy({ params, response }) {
        const notification_id = await Database.from("notifications")
        .where("uuid", params.id)
        .first();  
        if (!notification_id) {
          return response.notFound({ message: "Notification not found" });
        }  
        const notification: any = await Notification.find(notification_id.id);
           
        await notification.delete();
    
        return response.ok({ message: "Notification deleted successfully." });
      }
}
