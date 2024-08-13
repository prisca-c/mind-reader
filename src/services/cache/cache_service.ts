import { CacheInterface } from './cache_interface.js'
import redis from '@adonisjs/redis/services/main'

export class CacheService implements CacheInterface {
  async get(key: string): Promise<string | null> {
    return redis.get(key)
  }

  async set(key: string, value: string): Promise<boolean> {
    try {
      await redis.set(key, value)
      return true
    } catch (error) {
      return false
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      await redis.del(key)
      return true
    } catch (error) {
      return false
    }
  }

  async keys(pattern: string): Promise<string[]> {
    return redis.keys(pattern)
  }

  async flush(): Promise<boolean> {
    try {
      await redis.flushdb()
      return true
    } catch (error) {
      return false
    }
  }
}
