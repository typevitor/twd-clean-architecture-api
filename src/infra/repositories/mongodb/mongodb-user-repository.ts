import { UserData } from '@/entities'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports/user-repository'
import { MongoHelper } from './helpers'

export class MongoDbUserRepository implements UserRepository {
  async add (user: UserData): Promise<void> {
    const userCollection = MongoHelper.getCollection('users')
    const exists = await this.exists(user)
    if (!exists) {
      const userClone: UserData = { ...user }
      await userCollection.insertOne(userClone)
    }
  }

  async findUserByEmail (email: string): Promise<UserData> {
    const userCollection = MongoHelper.getCollection('users')
    const result = await userCollection.findOne<UserData>({ email })
    return result
  }

  async findAllUsers (): Promise<UserData[]> {
    return await MongoHelper.getCollection('users').find<UserData>({}).toArray()
  }

  async exists (user: UserData): Promise<boolean> {
    const result = await this.findUserByEmail(user.email)
    if (result != null) {
      return true
    }
    return false
  }
}
