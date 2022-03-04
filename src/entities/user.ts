import { Either, left, right } from '@/shared/either'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { UserData, Name, Email } from '@/entities'

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
      return left(nameOrError.value)
    }
    const emailOrError = Email.create(userData.email)
    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }
    const name: Name = nameOrError.value as Name
    const email: Email = emailOrError.value as Email
    return right(new User(name, email))
  }
}
