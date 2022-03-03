import { User } from '@/entities/user'

describe('User domain entity', () => {
  test('Should not create user with an invalid e-mail address', () => {
    const invalidEmail = 'invalid_emailmail.com'
    const error = User.create({ name: 'any_name', email: invalidEmail }).value as Error
    expect(error.name).toBe('InvalidEmailError')
    expect(error.message).toEqual('Invalid email :' + invalidEmail)
  })

  test('Should create user with valid Data', () => {
    const validEmail = 'any_email@mail.com'
    const validName = 'Any Name'
    const user: User = User.create({ name: validName, email: validEmail }).value as User
    expect(user.name.value).toEqual(validName)
    expect(user.email.value).toEqual(validEmail)
  })
})
