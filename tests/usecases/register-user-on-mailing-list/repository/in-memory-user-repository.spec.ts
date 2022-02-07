import { UserData } from '@/entities/user-data'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository/in-memory-user-repository'

describe('In Memory User Repository', () => {
  test('should return null if user is not found', async () => {
    const users: UserData[] = []
    const sut = new InMemoryUserRepository(users)
    const user = await sut.findUserByEmail('any@email.com')
    expect(user).toBeNull()
  })

  test('should return user if it is found in repository', async () => {
    const users: UserData[] = []
    const name: string = 'any_name'
    const email: string = 'any@email.com'
    const sut = new InMemoryUserRepository(users)
    await sut.add({ name, email })
    const user = await sut.findUserByEmail('any@email.com')
    expect(user.name).toBe('any_name')
  })

  test('should return all users in the repository', async () => {
    const users: UserData[] = [
      { name: 'any_name', email: 'any@email.com' },
      { name: 'another_name', email: 'another@email.com' }
    ]
    const sut = new InMemoryUserRepository(users)
    const allUsers = sut.findAllUsers()
    expect((await allUsers).length).toBe(2)
  })
})
