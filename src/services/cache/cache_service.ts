import redis from '@adonisjs/redis/services/main'
import { CacheInterface } from './cache_interface.js'

export class CacheService implements CacheInterface {
  public async get(key: string): Promise<string | null> {
    return redis.get(key)
  }

  public async set(key: string, value: string): Promise<boolean> {
    try {
      await redis.set(key, value)
      return true
    } catch (error) {
      return false
    }
  }

  public async del(key: string): Promise<boolean> {
    try {
      await redis.del(key)
      return true
    } catch (error) {
      return false
    }
  }

  public async keys(pattern: string): Promise<string[]> {
    return redis.keys(pattern)
  }

  public async flush(): Promise<boolean> {
    try {
      await redis.flushdb()
      return true
    } catch (error) {
      return false
    }
  }
}
