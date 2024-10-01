import { UserPort } from '#features/user/contracts/user_port'
import User from '#models/user'

export class UserDatabaseAdapter implements UserPort {
  async findOrCreate(email: string, payload: Partial<User>): Promise<User> {
    return await User.firstOrCreate({ email: email }, { ...payload })
  }
}
