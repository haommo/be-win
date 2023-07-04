// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Address from "App/Models/Address";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
const { v1: uuidv1 } = require("uuid");
import Database from "@ioc:Adonis/Lucid/Database";



export default class AddressesController {
    public async index({ response }) {
        const address = await Address.all();
    
        return response.ok(address);
      }
    
      public async store({ auth, request, response }) {
        const addressSchema = schema.create({
          name: schema.string({ trim: true }, [rules.maxLength(255)]),
      
          number: schema.number(),
    
          country: schema.string({ trim: true }, [rules.maxLength(255)]),
        
          address_first: schema.string({ trim: true }, [rules.maxLength(255)]),

        });
    
    
        const payload: any = await request.validate({ schema: addressSchema });

        payload.email = request.input("email");
        payload.state = request.input("state");
        payload.city = request.input("city");
        payload.address_second = request.input("address_second");
        payload.zip = request.input("zip");
        payload.company = request.input("company");
        payload.type = request.input("type");
        payload.uuid = uuidv1();
        payload.created_by = auth.user.uuid;
        const address: Address = await Address.create(payload);
    
        return response.ok(address);
      }
    
      public async show({ params, response }) {
        const address = await Database.from("addresses")
        .where("uuid", params.id)
        .first();    
        if (!address) {
          return response.notFound({ message: "Address not found" });
        }
    
        return response.ok(address);
      }
    
      public async update({ request, params, response }) {
        const addressSchema = schema.create({
          name: schema.string({ trim: true }, [rules.maxLength(255)]),
      
          number: schema.number(),
    
          country: schema.string({ trim: true }, [rules.maxLength(255)]),
        
          address_first: schema.string({ trim: true }, [rules.maxLength(255)]),
        });
    
        const payload: any = await request.validate({ schema: addressSchema });
    
        payload["email"] = request.input("email");
        payload["state"] = request.input("state");
        payload["city"] = request.input("city");
        payload["address_second"] = request.input("address_second");
        payload["zip"] = request.input("zip");
        payload["company"] = request.input("company");
        payload["type"] = request.input("type");


        const address_id = await Database.from("addresses")
        .where("uuid", params.id)
        .first();    
        const address: any = await Address.find(address_id.id);
        if (!address) {
          return response.notFound({ message: "Address not found" });
        }
    
        address.name = payload.name;
        address.company = payload.company;
        address.number = payload.number;
        address.email = payload.email;
        address.country = payload.country;
        address.address_first = payload.address_first;
        address.address_second = payload.address_second;
        address.city = payload.city;
        address.state = payload.state;
        address.zip = payload.zip;
        address.type = payload.type;
    
        await address.save();
    
        return response.ok({ message: "address successfully update", address });
      }
    
      public async destroy({ params, response }) {
        const address_id = await Database.from("addresses")
        .where("uuid", params.id)
        .first();       
        const address: any = await Address.find(address_id.id);
        if (!address) {
          return response.notFound({ message: "Address not found" });
        }
    
        await address.delete();
    
        return response.ok({ message: "Address deleted successfully." });
      }

      public async byuser({ params, response  }){
        const user = await Database.from("users")
    .where("uuid", params.user_uuid)
    .first();
    if (!user) {
      return response.notFound({ message: "Address not found" });
    }
    const address = await Database.from("addresses")
        .where("created_by", user.id);    
       
    
        return response.ok(address);
      }
}
