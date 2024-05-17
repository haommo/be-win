/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
 RL1 = ADMIN
 RL2 = MANAGER
 RL3 = EMPLOYEE
 RL4 = CUSTOMER
*/

import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async () => {
  return { hello: "world" };
});

Route.post("login", async ({ auth, request, response }) => {
  const email = request.input("email");
  const password = request.input("password");
  try {
    const token = await auth.use("api").attempt(email, password);
    return token;
  } catch(error) {
    return response.unauthorized({message : error.responseText});
  }
});

Route.post('/logout', async ({ auth, response }) => {
 await auth.use('api').revoke()
  return response.ok({ revoked: true , 
    massage : "successfully logout"
  })
}).middleware("auth")

Route.resource("users", "UsersController").middleware({
  index: ["auth", "adminManager"],
  show: ["auth"],
  update: ["auth"],
  destroy: ["auth", "admin"],
});

Route.resource("service", "ServicesController").middleware({
  index: ["auth"],
  show: ["auth"],
  store: ["auth", "admin"],
  update: ["auth", "admin"],
  destroy: ["auth", "admin"],
});


Route.resource("manifest", "ManifestShipmentsController").middleware({
  index: ["auth" , "adminManager"],
  show: ["auth" ,  "adminManager"],
  store: ["auth", "adminManager"],
  update: ["auth", "adminManager"],
  destroy: ["auth", "admin"],
});

Route.resource("address", "AddressesController").middleware({
  index: ["auth" , "adminManager"],
  show: ["auth"],
  store: ["auth"],
  update: ["auth"],
  destroy: ["auth"],
});

Route.resource("shipment", "ShipmentsController").middleware({
  index: ["auth"],
  show: ["auth"],
  store: ["auth"],
  update: ["auth" , "adminManager"],
  destroy: ["auth" , "admin"],
});

Route.get('addressbyuser/:user_uuid', 'AddressesController.byuser').middleware('auth');
Route.get('current-user', 'UsersController.current_user').middleware('auth');
Route.get('tracking/:hawb', 'ShipmentsController.tracking');
Route.post('api_tracking/', 'ShipmentsController.api_tracking');


Route.get('/export-shipments', 'ShipmentsController.exportToCSV'); //Export Shipment




