import Service from "App/Models/Service";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
const { v1: uuidv1 } = require("uuid");
import Database from "@ioc:Adonis/Lucid/Database";
import Drive from '@ioc:Adonis/Core/Drive';


export default class ServicesController {
  public async index({ response }) {
    const services = await Service.all();

    return response.ok(services);
  }

  public async store({ auth, request, response }) {
    
    const serviceSchema = schema.create({
      name: schema.string({ trim: true }, [rules.maxLength(255)]),
      description: schema.string({ trim: true }, [rules.maxLength(255)]),
    });
    
    const image = request.file("image", {
      size: "2mb",
    });

    const payload: any = await request.validate({ schema: serviceSchema }); 
    if (image) {
      await image.moveToDisk('service', {
        name: uuidv1() + "." + image.extname,
        overwrite: false,
      });
      payload.image = await Drive.getUrl('/service/'+image.fileName);
    }
    payload.active =  request.input('active');
    payload.uuid = uuidv1();
    payload.created_by= auth.user.uuid;
    const service: Service = await Service.create(payload);

    return response.ok(service);
  }

  public async show({ params, response }) {
    const service_id = await Database.from("services")
    .where("uuid", params.id)
    .first(); 
    const service: any = await Service.find(service_id.id);
    if (!service) {
      return response.notFound({ message: "Service not found" });
    }

    return response.ok(service);
  }

  public async update({ request, params, response }) {
    const serviceSchema = schema.create({
      name: schema.string({ trim: true }, [rules.maxLength(255)]),
      description: schema.string({ trim: true }, [rules.maxLength(255)]), 
    });
    
    const image = request.file("image", {
      size: "2mb",
    });
    const payload: any = await request.validate({ schema: serviceSchema });
    if (image) {
      await image.moveToDisk('service', {
        name: uuidv1() + "." + image.extname,
        overwrite: false,
      });
      payload.image = await Drive.getUrl('/service/'+image.fileName);
    }
    payload.active =  request.input('active');


    const service_id = await Database.from("services")
    .where("uuid", params.id)
    .first(); 
    const service: any = await Service.find(service_id.id);
    if (!service) {
      return response.notFound({ message: "Service not found" });
    }

    service.name = payload.name;
    service.description = payload.description;
    service.image = payload.image;
    service.active = payload.active;

    await service.save();

    return response.ok({ message: "Service successfully update", service });
  }

  public async destroy({ params, response }) {
    const service_id = await Database.from("services")
    .where("uuid", params.id)
    .first();
    
    if (!service_id) {
      return response.notFound({ message: "Service not found" });
    }
    const service: any = await Service.find(service_id.id);
    
    await service.delete();

    return response.ok({ message: "Service deleted successfully." });
  }
}
