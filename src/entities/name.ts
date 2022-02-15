import { Either, left, right } from '@/shared/either'
import { InvalidNameError } from './errors'

export class Name {
  private readonly name: string

  constructor (name: string) {
    this.name = name
  }

  static create (name: string): Either<InvalidNameError, Name> {
    if (Name.validate(name)) {
      return right(new Name(name))
    }
    return left(new InvalidNameError())
  }

  static validate (name: string): boolean {
    if (!name) return false
    if (name.trim().length <= 2) return false
  }
}
