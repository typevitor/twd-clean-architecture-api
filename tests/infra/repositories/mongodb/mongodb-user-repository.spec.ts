import { UserData } from '@/entities'
import { MongoHelper } from '@/infra/repositories/mongodb/helpers'
import { MongoDbUserRepository } from '@/infra/repositories/mongodb'

describe('MongoDB User Repository', () => {
  beforeAll(async () => {
    console.log(process.env.MONGO_URL)
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
})
