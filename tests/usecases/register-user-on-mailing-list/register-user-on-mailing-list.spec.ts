import { UserData } from '@/usecases/register-user-on-mailing-list/user-data'

describe('Register user on mailing list use case', () => {
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    console.log(users)
    // const repo: UserRepository = InMemoryUserRepository(users)
    // const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    // const name = 'any_name'
    // const email = 'any_email@email.com'
    // const response = await usecase.registerUserOnMailingList({ name, email })
    // const user = repo.findUserByEmail('any_email@email.com')
    // expect((await user).name).toBe('any_name')
  })
})
