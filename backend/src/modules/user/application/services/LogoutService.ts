import IService from '@common/interfaces/IService';
import AppContext from '@common/utils/AppContext';
import redisCache from '@common/cache/RedisCache';

/**
 * Service class for handling user logout.
 */
export default class LogoutService implements IService<void> {
  constructor(private readonly appContext: AppContext) {}

  /**
   * Executes the logic for user logout.
   *
   * @param refreshTokenHash - The hash of the refresh token to be invalidated.
   * @returns A Promise that resolves once the refresh token is deleted from the cache.
   */
  public async execute(refreshTokenHash: string): Promise<void> {
    await redisCache.getClient().del(refreshTokenHash);
  }
}
