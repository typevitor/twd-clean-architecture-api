import { UserData } from '@/usecases/register-user-on-mailing-list/user-data'
import { InMemoryUserRepository } from '../../../../src/usecases/register-user-on-mailing-list/repository/in-memory-user-repository'

describe('In Memory User Repository', () => {
  test('should return null if user is not found', async () => {
    const users: UserData[] = []
    const userRepo = new InMemoryUserRepository(users)
    const user = await userRepo.findUserByEmail('any@email.com')
    expect(user).toBeNull()
  })

  test('should return user if it is found in repository', async () => {
    const users: UserData[] = []
    const name: string = 'any_name'
    const email: string = 'any@email.com'
    const userRepo = new InMemoryUserRepository(users)
    await userRepo.add({ name, email })
    const user = await userRepo.findUserByEmail('any@email.com')
    expect(user.name).toBe('any_name')
  })
})
