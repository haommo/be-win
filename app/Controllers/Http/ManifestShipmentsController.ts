// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ManifestShipment from "App/Models/Manifest";
import ListShipment from "App/Models/ManifestShipment";
import ManifestHistory from "App/Models/ManifestHistory";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
const { v1: uuidv1 } = require("uuid");
import Database from "@ioc:Adonis/Lucid/Database";

export default class ManifestShipmentsController {
  public async index({ response }) {
    const manifestShipment = await ManifestShipment.all();
    console.log(manifestShipment)
    return response.ok({ manifestShipment });
    
  }

  public async store({ auth, request, response }) {
    let manifest_id;
    try {
      const uniqueIdInt = Math.floor(1000000000 + Math.random() * 9000000000);
      const manifestSchema = schema.create({
        airway_bill_number: schema.string({ trim: true }, [
          rules.maxLength(255),
        ]),
        airline: schema.string({ trim: true }, [rules.maxLength(255)]),
        country: schema.string({ trim: true }, [rules.maxLength(255)]),
        status: schema.string({ trim: true }, [rules.maxLength(255)]),
        total_hawb: schema.string({ trim: true }, [rules.maxLength(255)]),
        total_gross_weight: schema.string({ trim: true }, [
          rules.maxLength(255),
        ]),
        total_charge_weight: schema.string({ trim: true }, [
          rules.maxLength(255),
        ]),
      });

      const payload: any = await request.validate({ schema: manifestSchema });
      payload.manifest_id = uniqueIdInt;
      payload.created_by = auth.user.uuid;
      payload.date = request.input("date");

      const manifest: ManifestShipment = await ManifestShipment.create(payload);
      manifest_id = manifest.id;
      
      const list_shipmentsArray = JSON.parse(request.input("list_shipments"));

      for (const item of list_shipmentsArray) {
        const ListShipments = new ListShipment();
        ListShipments.uuid = uuidv1();
        ListShipments.manifest_id = manifest.manifest_id;
        ListShipments.hawb = item.hawb;
        ListShipments.receiver_name = item.receiver_name;
        ListShipments.gross_weight = item.gross_weight;
        ListShipments.volume_weight = item.volume_weight;
        ListShipments.charge_weight = item.charge_weight;
        await ListShipments.save();
      }
      return response.ok({ manifest });
    } catch (error) {
      console.log(manifest_id);
      await ManifestShipment.query().where("id", manifest_id).delete();
      return response.notFound({
        message: error,
      });
    }
  }

  public async show({ params, response }) {
    const manifest_Shipment = await Database.from("manifest_shipments")
      .where("manifest_id", params.id)
      .first();
      if (!manifest_Shipment) {
        return response.notFound({ message: "ManifestShipment not found" });
      }
      
    const list_shipments = await Database.from("list_shipments").where(
      "manifest_id",
      manifest_Shipment.manifest_id
    );
  
    const Manifest_History = await Database.from("manifest_histories").where(
      "manifest_id",
      manifest_Shipment.manifest_id
    );
    
  

    return response.ok({
      manifest_Shipment: manifest_Shipment,
      list_shipments: list_shipments,
      Manifest_History: Manifest_History,
    });
  }

  public async update({ request, params, response }) {
    const Manifest_ShipmentSchema = schema.create({
      // date: schema.number(),
      airway_bill_number: schema.string({ trim: true }, [rules.maxLength(255)]),
      airline: schema.string({ trim: true }, [rules.maxLength(255)]),
      country: schema.string({ trim: true }, [rules.maxLength(255)]),
      status: schema.string({ trim: true }, [rules.maxLength(255)]),
      total_hawb: schema.string({ trim: true }, [rules.maxLength(255)]),
      total_gross_weight: schema.string({ trim: true }, [rules.maxLength(255)]),
      total_charge_weight: schema.string({ trim: true }, [
        rules.maxLength(255),
      ]),
    });

    const payload: any = await request.validate({
      schema: Manifest_ShipmentSchema,
    });
    payload.date = request.input("date");

    const manifest_shipment: any = await ManifestShipment.findBy("manifest_id", params.id);

    if (!manifest_shipment) {
      return response.notFound({ message: "List Shipment not found" });
    }

    manifest_shipment.date = payload.date;
    manifest_shipment.airway_bill_number = payload.airway_bill_number;
    manifest_shipment.airline = payload.airline;
    manifest_shipment.country = payload.country;
    manifest_shipment.status = payload.status;
    manifest_shipment.total_hawb = payload.total_hawb;
    manifest_shipment.total_gross_weight = payload.total_gross_weight;
    manifest_shipment.total_charge_weight = payload.total_charge_weight;

    await manifest_shipment.save();

    await ListShipment.query().where("manifest_id", params.id).delete();
    await ManifestHistory.query()
      .where("manifest_id", params.id)
      .delete();

    const list_shipmentsArray = JSON.parse(request.input("list_shipments"));

    list_shipmentsArray.forEach(async (item) => {
      const ListShipments = new ListShipment();
      ListShipments.uuid = uuidv1();
      ListShipments.manifest_id = params.id;
      ListShipments.hawb = item.hawb;
      ListShipments.receiver_name = item.receiver_name;
      ListShipments.gross_weight = item.gross_weight;
      ListShipments.volume_weight = item.volume_weight;
      ListShipments.charge_weight = item.charge_weight;

      await ListShipments.save();
    });

    const Manifest_historyArray = JSON.parse(request.input("Manifest_history"));

    Manifest_historyArray.forEach(async (item) => {
      const ManifestHistorys = new ManifestHistory();
      ManifestHistorys.uuid = uuidv1();
      ManifestHistorys.manifest_id = params.id;
      ManifestHistorys.date = item.date;
      ManifestHistorys.flight = item.flight;
      ManifestHistorys.detail = item.detail;
      ManifestHistorys.location = item.location;

      await ManifestHistorys.save();
    });

    return response.ok({
      message: "shipment product successfully update",
      manifest_shipment,
    });
  }

  public async destroy({ params, response }) {
    const manifest_id = await Database.from("manifest_shipments")
      .where("manifest_id", params.id)
      .first();
      if (!manifest_id) {
        return response.notFound({ message: "Manifest Shipment not found" });
      }
    const manifest_shipment: any = await ManifestShipment.find(manifest_id.id);
    
    await manifest_shipment.delete();

    return response.ok({ message: "Manifest Shipment deleted successfully." });
  }
}
