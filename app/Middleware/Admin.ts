import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Admin {
  public async handle({ auth,response }: HttpContextContract, next: () => Promise<void>) {
    const user: any = auth.user;
   if(user.role!='RL1')
   return response.status(401).send('Unauthenticated')
   await next()
  }
}
