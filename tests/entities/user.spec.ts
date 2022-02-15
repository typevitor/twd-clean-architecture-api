import { User } from '@/entities/user'
import { left } from '@/shared/either'
import { InvalidEmailError } from '@/entities/errors/invalid-email-error'

describe('User domain entity', () => {
  test('Should not create user with an invalid e-mail address', () => {
    const invalidEmail = 'invalid_emailmail.com'
    const userOrError = User.create({ name: 'any_name', email: invalidEmail })
    expect(userOrError).toEqual(left(new InvalidEmailError()))
  })
})
