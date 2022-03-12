import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository/in-memory-user-repository'
import { RegisterUserController } from '@/web-controllers'

export const makeRegisterUserController = (): RegisterUserController => {
  const inMemoryUserRepository = new InMemoryUserRepository([])
  const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(inMemoryUserRepository)
  const registerUserController: RegisterUserController = new RegisterUserController(registerUserOnMailingListUseCase)
  return registerUserController
}
