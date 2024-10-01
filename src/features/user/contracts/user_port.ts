import User from '#models/user'

export abstract class UserPort {
  abstract findOrCreate(email: string, payload: Partial<User>): Promise<User>
}
