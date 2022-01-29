import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports/user-repository'
import { UserData } from '@/usecases/register-user-on-mailing-list/user-data'

export class InMemoryUserRepository implements UserRepository {
  private repository: UserData[]

  constructor (repository: UserData[]) {
    this.repository = repository
  }

  async add (user: UserData): Promise<void> {
    const exists = await this.exists(user)
    if (!exists) {
      this.repository.push(user)
    }
  }

  async findUserByEmail (email: string): Promise<UserData> {
    const users = this.repository.filter(user => {
      return user.email === email
    })
    return (users.length > 0) ? users[0] : null
  }

  async findAllUsers (): Promise<UserData[]> {
    return this.repository
  }

  async exists (user: UserData): Promise<boolean> {
    return (await this.findUserByEmail(user.email) !== null)
  }
}
