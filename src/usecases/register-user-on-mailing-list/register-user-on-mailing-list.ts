import { User, UserData } from '@/entities'
import { UserRepository } from './ports/user-repository'
import { UseCase } from '@/usecases/ports/use-case'

export class RegisterUserOnMailingList implements UseCase {
  private readonly userRepo: UserRepository

  constructor (userRepo: UserRepository) {
    this.userRepo = userRepo
  }

  public async perform (request: User): Promise<UserData> {
    const userRequest = { name: request.name.value, email: request.email.value }
    const userDontExists = !(await this.userRepo.exists(userRequest))
    if (userDontExists) {
      await this.userRepo.add(userRequest)
    }
    return userRequest
  }
}
