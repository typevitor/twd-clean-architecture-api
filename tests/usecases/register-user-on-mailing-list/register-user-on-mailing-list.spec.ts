import { UserData } from '@/entities/user-data'
import { UserRepository } from './ports/user-repository'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository/in-memory-user-repository'
import { User } from '@/entities'

describe('Register user on mailing list use case', () => {
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name = 'any_name'
    const email = 'any_email@email.com'
    const user = User.create({ name, email }).value as User
    const response = await usecase.perform(user)
    const addedUser = repo.findUserByEmail('any_email@email.com')
    expect((await addedUser).name).toBe('any_name')
    expect(response.name).toBe('any_name')
  })
})
