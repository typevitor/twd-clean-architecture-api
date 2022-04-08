import { UserData } from '@/entities'
import { MongoHelper } from '@/infra/repositories/mongodb/helpers'
import { MongoDbUserRepository } from '@/infra/repositories/mongodb'

describe('MongoDB User Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await MongoHelper.clearCollection('users')
  })

  test('should add valid user to mongodb', async () => {
    const userData: UserData = {
      name: 'Any Name',
      email: 'any@email.com'
    }
    const userRepository = new MongoDbUserRepository()
    await userRepository.add(userData)
    expect((await userRepository.exists(userData))).toBeTruthy()
  })

  test('should return all added users when findAll is called', async () => {
    const userRepository = new MongoDbUserRepository()
    await userRepository.add({
      name: 'Any Name',
      email: 'any@email.com'
    })
    await userRepository.add({
      name: 'Other Name',
      email: 'other@email.com'
    })
    const users = await userRepository.findAllUsers()
    expect(users[0].name).toBe('Any Name')
    expect(users[1].name).toBe('Other Name')
  })
})
