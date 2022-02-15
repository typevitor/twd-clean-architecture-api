import { Either, left } from '@/shared/either'
import { InvalidEmailError, InvalidNameError } from './errors'
import { UserData } from './user-data'
import { Email } from './email'
import { Name } from './name'

type InvalidUserError = InvalidNameError | InvalidEmailError;
export class User {
  static create (userData: UserData): Either<InvalidUserError, User> {
    const nameOrError = Name.create(userData.name)
    if (nameOrError.isLeft()) {
      return left(new InvalidNameError())
    }
    const emailOrError = Email.create(userData.email)
    if (emailOrError.isLeft()) {
      return left(new InvalidEmailError())
    }
  }
}
