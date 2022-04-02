import { User, UserData } from '@/entities'
import { Either, left, right } from '@/shared/either'
import { UseCase } from '@/usecases/ports/use-case'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list'
import { SendMailError } from '@/usecases/errors/send-mail-error'
import { SendEmailUseCase } from '@/usecases/send-email'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'

export class RegisterAndSendEmailUseCase implements UseCase {
  private readonly registerUser: RegisterUserOnMailingList;
  private readonly sendMail: SendEmailUseCase;

  constructor (registerUser: RegisterUserOnMailingList, sendMail: SendEmailUseCase) {
    this.registerUser = registerUser
    this.sendMail = sendMail
  }

  async perform (userData: UserData): Promise<Either<SendMailError, UserData>> {
    const userOrError: Either<InvalidNameError | InvalidEmailError, User> = User.create(userData)
    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }
    const user = userOrError.value as User
    await this.registerUser.perform(user)
    const sendEmailOrError = await this.sendMail.perform(user)
    if (sendEmailOrError.isLeft()) {
      return left(sendEmailOrError.value)
    }
    return right({ name: user.name.value, email: user.email.value })
  }
}
