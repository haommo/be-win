import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminManager {
  public async handle({ auth,response }: HttpContextContract, next: () => Promise<void>) {
    let user: any= auth.user;
   if(user.role!='RL1' && user.role!='RL2')
   return response.status(401).send('Unauthenticated')
   await next()
  }
}
