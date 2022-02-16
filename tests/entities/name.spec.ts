import { User } from '@/entities/user'
import { left } from '@/shared/either'
import { InvalidNameError } from '@/entities/errors'

describe('Name Validation', () => {
  test('Should not create user with no name', () => {
    const invalidName = null
    const userOrError = User.create({ name: invalidName, email: 'valid@mail.com' })
    expect(userOrError).toEqual(left(new InvalidNameError()))
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
