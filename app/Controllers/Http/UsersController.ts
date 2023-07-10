import User from "App/Models/User";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Database from "@ioc:Adonis/Lucid/Database";
import Drive from '@ioc:Adonis/Core/Drive';

const { v1: uuidv1 } = require("uuid");
export default class UsersController {
  public async index({ response }) {
    const users = await User.all();

    return response.ok(users);
  }

  public async store({ request, response }) {
    try {
      const userSchema = schema.create({
        name: schema.string({ trim: true }, [rules.maxLength(255)]),

        email: schema.string({ trim: true }, [rules.maxLength(255)]),

        password: schema.string({ escape: true }, [rules.maxLength(1000)]),
      });
      
      const image = request.file("image", {
        size: "2mb",
      });

      const payload: any = await request.validate({ schema: userSchema });
      if (image) {
        await image.moveToDisk('user_photo', {
          name: uuidv1() + "." + image.extname,
          overwrite: false,
        });
        payload.image = await Drive.getUrl('/user_photo/'+image.fileName);
      }
      payload.number = request.input("number");
      payload.country = request.input("country");
      payload.state = request.input("state");
      payload.city = request.input("city");
      payload.address = request.input("address");
      payload.zip = request.input("zip");
      payload.company = request.input("company");
      payload.role = "RL3";
      payload.status = request.input("status");
      payload.email_verify = request.input("email_verify");
      payload.uuid = uuidv1();
      
      const user: User = await User.create(payload);
      
      return response.ok(user);
       } catch(error) {
      return response.unauthorized({
      message : error.sqlMessage
    });
    }
  }

  public async show({ params, response }) {
    const user_id = await Database.from("users")
      .where("uuid", params.id)
      .first();

    const user: any = await User.find(user_id.id);
    if (!user) {
      return response.notFound({ message: "User not found" });
    }

    return response.ok(user);
  }

  public async update({ auth, request, params, response }) {
    const userSchema = schema.create({
      name: schema.string({ trim: true }, [rules.maxLength(255)]),
    });

    const image = request.file("image", {
      size: "2mb",
    });
    const payload: any = await request.validate({ schema: userSchema });
    if (image) {
      await image.moveToDisk('user_photo', {
        name: uuidv1() + "." + image.extname,
        overwrite: false,
      });
      payload.image = await Drive.getUrl('/user_photo/'+image.fileName);
    }
    if (auth.user.role == "RL1" || auth.user.role == "RL2") {
      payload["email"] = request.input("email");
      payload["role"] = request.input("role");
    } else if (
      request.input("email") != null ||
      request.input("role") != null
    ) {
      return response.notFound({
        message: "you have no permission to update for email and roles",
      });
    }
    payload["country"] = request.input("country");
    payload["state"] = request.input("state");
    payload["city"] = request.input("city");
    payload["address"] = request.input("address");
    payload["zip"] = request.input("zip");
    payload["company"] = request.input("company");
    payload["status"] = request.input("status");

    const user_id = await Database.from("users")
      .where("uuid", params.id)
      .first();

    const user: any = await User.find(user_id.id);
    if (!user) {
      return response.notFound({ message: "User not found" });
    }

    user.name = payload.name;
    user.email = payload.email;
    user.number = payload.number;
    user.country = payload.country;
    user.state = payload.state;
    user.city = payload.city;
    user.address = payload.address;
    user.zip = payload.zip;
    user.company = payload.company;
    user.role = payload.role;
    user.image = payload.image;
    user.status = payload.status;

    await user.save();

    return response.ok({ message: "User successfully update", user });
  }

  public async destroy({ params, response }) {
    const user_id = await Database.from("users")
      .where("uuid", params.id)
      .first();
      if (!user_id) {
        return response.notFound({ message: "User not found" });
      }
    const user: any = await User.find(user_id.id);
    

    await user.delete();

    return response.ok({ message: "User deleted successfully." });
  }

  public async current_user({ auth, response }) {
    const user = await Database.from("users").where("id", auth.user.id).first();
    return response.ok(user);
  }
}
