import { Either, left, right } from '@/shared/either'
import { InvalidEmailError, InvalidNameError } from './errors'
import { UserData } from './user-data'
import { Email } from './email'
import { Name } from './name'

type InvalidUserError = InvalidNameError | InvalidEmailError;
export class User {
  public readonly email: Email
  public readonly name: Name

  private constructor (name: Name, email: Email) {
    this.name = name
    this.email = email
  }

  static create (userData: UserData): Either<InvalidUserError, User> {
    const nameOrError = Name.create(userData.name)
    if (nameOrError.isLeft()) {
      return left(new InvalidNameError())
    }
    const emailOrError = Email.create(userData.email)
    if (emailOrError.isLeft()) {
      return left(new InvalidEmailError())
    }
    const name: Name = nameOrError.value as Name
    const email: Email = emailOrError.value as Email
    return right(new User(name, email))
  }
}
