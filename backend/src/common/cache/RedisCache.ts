import Redis from 'ioredis';
import redisConfig from '@config/cache';

/**
 * Represents a Redis cache with a dedicated Redis client.
 */
class RedisCache {
  /**
   * The Redis client instance used for caching operations.
   */
  private readonly client: Redis;

  /**
   * Creates a new instance of the RedisCache class with a dedicated Redis client.
   */
  constructor() {
    this.client = new Redis({
      ...redisConfig,
    });
  }

  /**
   * Gets the Redis client instance associated with the cache.
   *
   * @returns The Redis client instance.
   */
  public getClient(): Redis {
    return this.client;
  }
}

export default new RedisCache();
