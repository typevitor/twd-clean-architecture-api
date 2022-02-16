import { User } from '@/entities/user'
import { left } from '@/shared/either'
import { InvalidEmailError } from '@/entities/errors'

describe('User domain entity', () => {
  test('Should not create user with an invalid e-mail address', () => {
    const invalidEmail = 'invalid_emailmail.com'
    const userOrError = User.create({ name: 'any_name', email: invalidEmail })
    expect(userOrError).toEqual(left(new InvalidEmailError()))
  })

  test('Should create user with valid Data', () => {
    const validEmail = 'any_email@mail.com'
    const validName = 'Any Name'
    const user: User = User.create({ name: validName, email: validEmail }).value as User
    expect(user.name.value).toEqual(validName)
    expect(user.email.value).toEqual(validEmail)
  })
})
