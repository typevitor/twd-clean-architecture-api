import { MongoDbUserRepository } from '@/infra/repositories/mongodb'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list'
import { RegisterUserController } from '@/web-controllers'

export const makeRegisterUserController = (): RegisterUserController => {
  const mongoDbUserRepository = new MongoDbUserRepository()
  const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(mongoDbUserRepository)
  const registerUserController: RegisterUserController = new RegisterUserController(registerUserOnMailingListUseCase)
  return registerUserController
}
