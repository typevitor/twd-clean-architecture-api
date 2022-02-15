import { User } from '@/entities/user'
import { left } from '@/shared/either'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'

describe('User domain entity', () => {
  test('Should not create user with an invalid e-mail address', () => {
    const invalidEmail = 'invalid_emailmail.com'
    const userOrError = User.create({ name: 'any_name', email: invalidEmail })
    expect(userOrError).toEqual(left(new InvalidEmailError()))
  })

  test('Should not create user with a name less than 2 chars', () => {
    const invalidName = 'D      '
    const userOrError = User.create({ name: invalidName, email: 'valid@mail.com' })
    expect(userOrError).toEqual(left(new InvalidNameError()))
  })

  test('Should not create user with a name higher than 100 chars', () => {
    const invalidName = 'D'.repeat(300)
    const userOrError = User.create({ name: invalidName, email: 'valid@mail.com' })
    expect(userOrError).toEqual(left(new InvalidNameError()))
  })
})
