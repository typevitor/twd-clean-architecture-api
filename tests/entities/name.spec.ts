import { User } from '@/entities/user'

describe('Name Validation', () => {
  test('Should not create user with no name', () => {
    const invalidName = null
    const userOrError = User.create({ name: invalidName, email: 'valid@mail.com' }).value as Error
    expect(userOrError.name).toEqual('InvalidNameError')
    expect(userOrError.message).toEqual('Invalid name :' + invalidName)
  })

  test('Should not create user with a name less than 2 chars', () => {
    const invalidName = 'D      '
    const userOrError = User.create({ name: invalidName, email: 'valid@mail.com' }).value as Error
    expect(userOrError.name).toEqual('InvalidNameError')
    expect(userOrError.message).toEqual('Invalid name :' + invalidName)
  })

  test('Should not create user with a name higher than 100 chars', () => {
    const invalidName = 'D'.repeat(300)
    const userOrError = User.create({ name: invalidName, email: 'valid@mail.com' }).value as Error
    expect(userOrError.name).toEqual('InvalidNameError')
    expect(userOrError.message).toEqual('Invalid name :' + invalidName)
  })
})
