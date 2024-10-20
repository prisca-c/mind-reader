import User from '#models/user'

export abstract class UserPort {
  public abstract findOrCreate(email: string, payload: Partial<User>): Promise<User>
}
