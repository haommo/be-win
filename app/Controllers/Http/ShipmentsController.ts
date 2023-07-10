// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Shipment from "App/Models/Shipment";
import ShipmentProductInfo from "App/Models/ShipmentProductInfo";
import ShipmentPackageInfo from "App/Models/ShipmentPackageInfo";
import ShipmentHistory from "App/Models/ShipmentHistory";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
const { v1: uuidv1 } = require("uuid");
import axios from "axios";

import Database from "@ioc:Adonis/Lucid/Database";

export default class ShipmentsController {

  /* Start - Get list all shipment */
  public async index({ auth, response }) {
    if (auth.user.role == "RL1" || auth.user.role == "RL2") {
      const shipments = await Shipment.all();
    
      /* for (const item of shipments) {
        let shipment = item;
        if (shipment.status == null) {
          const shipment_histories = await this.get_status(
            shipment.hawb,
            shipment.localcode,
            shipment.localtracking
          );
          const lastStatus = shipment_histories[shipment_histories.length - 1];
          item["status"] = lastStatus.status;
        }
      } */
      return response.ok(shipments);
    } else {
      const shipments = await Database.from("shipments")
      .from("shipments")
        .where("created_for", auth.user.uuid)
        .select(
          "hawb",
          "status",
          "created_at",
          "receiver_address",
          "service_id",
          "created_at"
        );
      /* for (const item of shipments) {
        let shipment = item;
        if (shipment.status == null) {
          const shipment_histories = await this.get_status(
            shipment.hawb,
            shipment.localcode,
            shipment.localtracking
          );
          const lastStatus = shipment_histories[shipment_histories.length - 1];
          item["status"] = lastStatus.status;
        }
      } */
      return response.ok(shipments);
    }
  }
  /* End - Get list all shipment */

  /* Start - Create new shipment */
  public async store({ auth, request, response }) {
    const uniqueIdInt = Math.floor(10000000000 + Math.random() * 90000000000);

    const shipmentSchema = schema.create({
      shipment_method: schema.string({ trim: true }, [rules.maxLength(255)]),
      shipment_type: schema.string({ trim: true }, [rules.maxLength(255)]),
      reason_export: schema.string({ trim: true }, [rules.maxLength(255)]),
    });

    const payload: any = await request.validate({ schema: shipmentSchema });
    payload.hawb = uniqueIdInt;
    payload.created_by = auth.user.uuid;
    payload.service_id = request.input("service_id");
    payload.status = request.input("status");
    payload.shipment_content = request.input("shipment_content");
    payload.sender_address = request.input("sender_address");
    payload.receiver_address = request.input("receiver_address");
    if (auth.user.role == "RL1" || auth.user.role == "RL2") {
      payload.created_for = request.input("created_for");
    } else if (auth.user.role == "RL3" || auth.user.role == "RL4") {
      payload.created_for = auth.user.uuid;
    }

/*     if(auth.user.role == "RL1" || "RL2", request.input("created_for") == null){
      return response.notFound({
        message:
          "created_for required",
      });
    } */

    /* if (auth.user.role == "RL1" || auth.user.role == "RL2") {
      payload.localcode = request.input("localcode");
      payload.localtracking = request.input("localtracking");
    } else if (
      request.input("localcode") != null ||
      request.input("localtracking") != null || request.input("created_for") != null
    ) {
      return response.notFound({
        message:
          "you have no permission to update for localcode or localtracking or created_for",
      });
    } */

    const shipment: Shipment = await Shipment.create(payload);
    const dataArray = JSON.parse(request.input("product_data"));

    dataArray.forEach(async (item) => {
      const product = new ShipmentProductInfo();
      product.uuid = uuidv1();
      product.hawb = shipment.hawb;
      product.name = item.name;
      product.description = item.description;
      product.type = item.type;
      product.quantity = item.quantity;
      product.price = item.price;
      product.amount = item.amount;
      await product.save();
    });

    const packageArray = JSON.parse(request.input("package_data"));

    packageArray.forEach(async (item) => {
      const Package = new ShipmentPackageInfo();
      Package.uuid = uuidv1();
      Package.hawb = shipment.hawb;
      Package.quantity = item.quantity;
      Package.type = item.type;
      Package.length = item.length;
      Package.width = item.width;
      Package.height = item.height;
      Package.weight = item.weight;
      Package.subweight = item.subweight;
      Package.subvolume = item.subvolume;
      Package.subcharge = item.subcharge;
      await Package.save();
    });

    const jsonObject = JSON.parse(shipment.sender_address);
    const city = jsonObject.city;
    const country = jsonObject.country;
    let date_ob = new Date();

    const Shipment_History = new ShipmentHistory();
    Shipment_History.uuid = uuidv1();
    Shipment_History.hawb = shipment.hawb;
    Shipment_History.date = date_ob;
    Shipment_History.status = "pending";
    Shipment_History.detail = "Shipment create";
    Shipment_History.location = city + " " + country;
    await Shipment_History.save();

    if (shipment.status == null) {
      const shipment_histories = await this.get_status(
        shipment.hawb,
        shipment.localcode,
        shipment.localtracking
      );
     // console.log(shipment_histories, "status11");
      const lastStatus = shipment_histories[shipment_histories.length - 1];

      if (lastStatus != null) {
        shipment["status"] = lastStatus.status;
      }
    }

    return response.ok({
      shipment: shipment,
      Shipment_History: Shipment_History,
    });
  }
  /* End - Create new shipment */

  /* Start - Show detail shipment*/
  public async show({ params, response }) {
    const shipment = await Database.from("shipments")
      .where("hawb", params.id)
      .first();

    if (!shipment) {
      return response.notFound({ message: "Shipment not found" });
    }

    const shipment_package_infos = await Database.from(
      "shipment_package_infos"
    ).where("hawb", shipment.hawb);

    const shipment_product_infos = await Database.from(
      "shipment_product_infos"
    ).where("hawb", shipment.hawb);

    const shipment_history = await Database.from("shipment_histories").where(
      "hawb",
      shipment.hawb
    );

    let manifest_id = null;
    const Manifest_Shipment = await Database.from("manifest_shipments")
      .join(
        "list_shipments",
        "manifest_shipments.manifest_id",
        "=",
        "list_shipments.manifest_id"
      )
      .where("list_shipments.hawb", "=", shipment.hawb)
      .select("manifest_shipments.manifest_id")
      .first();
    if (Manifest_Shipment !== null) {
      manifest_id = Manifest_Shipment.manifest_id;
    }

    if (shipment.status == null) {
      const shipment_histories = await this.get_status(
        shipment.hawb,
        shipment.localcode,
        shipment.localtracking
      );
      const lastStatus = shipment_histories[shipment_histories.length - 1];

      if (lastStatus != null) {
        shipment["status"] = lastStatus.status;
      }
    }
    return response.ok({
      shipment: shipment,
      shipment_package_info: shipment_package_infos,
      shipment_product_info: shipment_product_infos,
      shipment_history: shipment_history,
      Manifest_id: manifest_id,
    });
  }
  /* End - Show detail shipment*/
   
  /* Start - Update shipment*/
  public async update({ auth, request, params, response }) {
    const shipmentSchema = schema.create({
      shipment_method: schema.string({ trim: true }, [rules.maxLength(255)]),
      shipment_type: schema.string({ trim: true }, [rules.maxLength(255)]),
      reason_export: schema.string({ trim: true }, [rules.maxLength(255)]),
    });

    const payload: any = await request.validate({ schema: shipmentSchema });

    if(auth.user.role == "RL1" && request.input("created_for") == null){
      return response.notFound({
        message:
          "created_for required",
      });
    } else if(auth.user.role == "RL2" && request.input("created_for") == null){
      return response.notFound({
        message:
          "created_for required",
      });
    }


    payload.service_id = request.input("service_id");
    payload.sender_address = request.input("sender_address");
    payload.receiver_address = request.input("receiver_address");
    payload.shipment_content = request.input("shipment_content");
    payload.localcode = request.input("localcode");
    payload.localtracking = request.input("localtracking");
    payload.created_for = request.input("created_for");
    payload.created_by = auth.user.uuid;
    payload.status = request.input("status");

    const shipment: any = await Shipment.findBy("hawb", params.id);

    if (!shipment) {
      return response.notFound({ message: "Shipment not found" });
    }
    //console.log(shipment);
    shipment.shipment_method = payload.shipment_method;
    shipment.shipment_type = payload.shipment_type;
    shipment.reason_export = payload.reason_export;
    shipment.service_id = payload.service_id;
    shipment.sender_address = payload.sender_address;
    shipment.receiver_address = payload.receiver_address;
    shipment.created_by = payload.created_by;
    shipment.shipment_content = payload.shipment_content;
    shipment.localtracking = payload.localtracking;
    shipment.localcode = payload.localcode;
    shipment.created_for = payload.created_for;
    shipment.status = payload.status;

    await shipment.save();
    await ShipmentPackageInfo.query().where("hawb", shipment.hawb).delete();
    await ShipmentProductInfo.query().where("hawb", shipment.hawb).delete();
    await ShipmentHistory.query().where("hawb", shipment.hawb).delete();

    const dataArray = JSON.parse(request.input("product_data"));

    dataArray.forEach(async (item) => {
      const product = new ShipmentProductInfo();
      product.uuid = uuidv1();
      product.hawb = shipment.hawb;
      product.name = item.name;
      product.description = item.description;
      product.type = item.type;
      product.quantity = item.quantity;
      product.price = item.price;
      product.amount = item.amount;
      await product.save();
    });

    const packageArray = JSON.parse(request.input("package_data"));

    packageArray.forEach(async (item) => {
      const Package = new ShipmentPackageInfo();
      Package.uuid = uuidv1();
      Package.hawb = shipment.hawb;
      Package.quantity = item.quantity;
      Package.type = item.type;
      Package.length = item.length;
      Package.width = item.width;
      Package.height = item.height;
      Package.weight = item.weight;
      Package.subweight = item.subweight;
      Package.subvolume = item.subvolume;
      Package.subcharge = item.subcharge;
      await Package.save();
    });

    const shipment_historyArray = JSON.parse(request.input("shipment_history"));

    shipment_historyArray.forEach(async (item) => {
      const Shipment_History = new ShipmentHistory();
      Shipment_History.uuid = uuidv1();
      Shipment_History.hawb = shipment.hawb;
      Shipment_History.date = item.date;
      Shipment_History.status = item.status;
      Shipment_History.detail = item.detail;
      Shipment_History.location = item.location;
      await Shipment_History.save();
    });

    if (shipment.status == null) {
      const shipment_histories = await this.get_status(
        shipment.hawb,
        shipment.localcode,
        shipment.localtracking
      );
     // console.log(shipment_histories, "status11");
      const lastStatus = shipment_histories[shipment_histories.length - 1];

      if (lastStatus != null) {
        shipment["status"] = lastStatus.status;
      }
    }

    return response.ok({
      message: "shipment product successfully update",
      shipment,
    });
  }
  /* End - Update shipment*/

  /* Start - Deleted shipment*/
  public async destroy({ params, response }) {
    const shipment_id = await Database.from("shipments")
      .where("hawb", params.id)
      .first();
    if (!shipment_id) {
      return response.notFound({ message: "Shipment not found" });
    }
    const shipment: any = await Shipment.find(shipment_id.id);

    await shipment.delete();

    return response.ok({ message: "Shipment deleted successfully." });
  }
  /* End - Deleted shipment*/
  
  /* Start - Tracking shipment*/
  public async tracking({ response, params }) {
    const shipments = await Database.from("shipments")
      .where("hawb", params.hawb)
      .select(
        "hawb",
        "sender_address",
        "receiver_address",
        "manifest_id",
        "localcode",
        "localtracking"
      )
      .first();

    if (!shipments) {
      return response.notFound({ message: "Shipment not found" });
    }

    const shipment_package_infos = await Database.from("shipment_package_infos")
      .sum("weight", "weight")
      .where("hawb", params.hawb);

    const Manifest_Shipment = await Database.from("manifest_shipments")
      .join(
        "list_shipments",
        "manifest_shipments.manifest_id",
        "=",
        "list_shipments.manifest_id"
      )
      .where("list_shipments.hawb", "=", shipments.hawb)
      .select("manifest_shipments.manifest_id")
      .first();

    const sender_address = shipments.sender_address;
    const receiver_address = shipments.receiver_address;
    const sender_country = sender_address.country;
    const receiver_country = receiver_address.country;
    const receiver_name = receiver_address.name;
    const receiver_phone = receiver_address.phone;

    const shipment_histories = await Database.from("shipment_histories")
      .where("hawb", params.hawb)
      .select("status", "detail", "date", "location");
    if (Manifest_Shipment !== null) {
      const manifest_history = await Database.from("manifest_histories")
        .where("manifest_id", Manifest_Shipment.manifest_id)
        .select("detail", "date", "location");
      for (const item of manifest_history) {
        item["status"] = "in_transit";
        shipment_histories.push(item);
      }
    }
    const qs = require("qs");
    let data = qs.stringify({
      courierCode: shipments.localcode,
      trackingNumber: shipments.localtracking,
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.ship24.com/public/v1/trackers/track",
      headers: {
        Authorization: "Bearer apik_5wWcCn6c91oDarpgNs4fXNDsecEJR2",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };
    let res;
    await axios
      .request(config)
      .then((response) => {
        res = JSON.stringify(response.data.data.trackings[0]);
      })
      .catch((error) => {
        console.log(error);
      });
    if (res) {
      res = JSON.parse(res);

      for (const item of res.events) {
        if (
          item.statusMilestone != "UNKNOWN" &&
          item.statusMilestone != "info_received"
        ) {
          let tracking = {};
          tracking["status"] = item.statusMilestone;
          tracking["detail"] = item.status;
          tracking["date"] = item.datetime;
          tracking["location"] = item.location;
          shipment_histories.push(tracking);
        }
      }
    }

/*     let sortedhistory = shipment_histories.sort((a, b) => (a.detail < b.detail) ? -1 : 1);
 */
    return response.ok({
      sender_country: sender_country,
      receiver_country: receiver_country,
      receiver_name: receiver_name,
      receiver_phone: receiver_phone,
      weight: shipment_package_infos[0].weight,
      tracking_history: shipment_histories,
    });
  }

  public async get_status(hawb, localcode, localtracking) {
    const Manifest_Shipment = await Database.from("manifest_shipments")
      .join(
        "list_shipments",
        "manifest_shipments.manifest_id",
        "=",
        "list_shipments.manifest_id"
      )
      .where("list_shipments.hawb", "=", hawb)
      .select("manifest_shipments.manifest_id")
      .first();

    const shipment_histories = await Database.from("shipment_histories")
      .where("hawb", hawb)
      .select("status", "date");
    if (Manifest_Shipment !== null) {
      const manifest_history = await Database.from("manifest_histories")
        .where("manifest_id", Manifest_Shipment.manifest_id)
        .select("date");
      for (const item of manifest_history) {
        item["status"] = "transit";
        shipment_histories.push(item);
      }
    }

    const qs = require("qs");
    let data = qs.stringify({
      carrier: localcode,
      tracking_number: localtracking,
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.goshippo.com/tracks/",
      headers: {
        Authorization:
          "ShippoToken shippo_live_d894c32ebfb34846af8bf8ff9b04e8e2e9ac10b2",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };
    let res;
    await axios
      .request(config)
      .then((response) => {
        res = JSON.stringify(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    if (res) {
      res = JSON.parse(res);

      for (const item of res.tracking_history) {
        if (item.status != "UNKNOWN" || item.status != "PRE_TRANSIT") {
          let tracking = {};
          tracking["status"] = item.status;
          tracking["date"] = item.status_date;
          shipment_histories.push(tracking);
        }
      }
    }
    return shipment_histories;
  }
}
