import { UserData } from '@/entities/user-data'
import { UserRepository } from './ports/user-repository'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository/in-memory-user-repository'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { left } from '@/shared/either'

describe('Register user on mailing list use case', () => {
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name = 'any_name'
    const email = 'any_email@email.com'
    const response = await usecase.registerUserOnMailingList({ name, email })
    const user = repo.findUserByEmail('any_email@email.com')
    expect((await user).name).toBe('any_name')
    expect(response.value.name).toBe('any_name')
  })

  test('should not add user with and invalid_email', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name = 'any_name'
    const invalidEmail = 'invalid_email.@email.com'
    const response = await usecase.registerUserOnMailingList({ name, email: invalidEmail })
    const user = repo.findUserByEmail(invalidEmail)
    expect((await user)).toBeNull()
    expect(response).toEqual(left(new InvalidEmailError()))
  })

  test('should not add user with and invalid name', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const invalidName = ''
    const email = 'valid_mail@email.com'
    const response = await usecase.registerUserOnMailingList({ name: invalidName, email })
    const user = repo.findUserByEmail(email)
    expect((await user)).toBeNull()
    expect(response).toEqual(left(new InvalidNameError()))
  })
})
