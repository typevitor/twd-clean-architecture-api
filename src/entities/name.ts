import { Either, left, right } from '@/shared/either'
import { InvalidNameError } from './errors'

export class Name {
  public readonly value: string

  constructor (name: string) {
    this.value = name
  }

  static create (name: string): Either<InvalidNameError, Name> {
    if (Name.validate(name)) {
      return right(new Name(name))
    }
    return left(new InvalidNameError(name))
  }

  static validate (name: string): boolean {
    if (!name) return false
    if (name.trim().length <= 2) return false
    if (name.trim().length > 100) return false
    return true
  }
}
