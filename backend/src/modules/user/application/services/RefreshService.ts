import AppException from '@common/exceptions/AppException';
import IService from '@common/interfaces/IService';
import AppContext from '@common/utils/AppContext';
import { HttpStatus } from '@common/utils/systemConstants';
import IUserRepository from '@modules/user/infra/interfaces/IUserRepository';
import { UserErrorMessages } from '../../domain/error-messages/UserErrorMessages';
import ITokenInfo from '@modules/user/domain/models/ITokenInfo';
import { createAccessToken, createHashForRefreshToken, createRefreshToken } from '../utils/authUtils';
import redisCache from '@common/cache/RedisCache';
import { AuthErrorMessages } from '@modules/user/domain/error-messages/AuthErrorMessages';
import RepositoryFactory from '@common/utils/RepositoryFactory';

/**
 * Service class for refreshing user tokens.
 */
export default class RefreshService implements IService<ITokenInfo> {
  constructor(private readonly appContext: AppContext) {}

  /**
   * Executes the logic for refreshing user tokens.
   *
   * @param refreshTokenHash - The hash of the refresh token to be used for refreshing.
   * @returns A Promise that resolves with a new set of access and refresh tokens.
   * @throws - {@link AppException} When the provided refresh token is invalid or the user is not found.
   */
  public async execute(refreshTokenHash: string): Promise<ITokenInfo> {
    const userEmail = await redisCache.getClient().get(refreshTokenHash);
    if (!userEmail) {
      throw new AppException(AuthErrorMessages.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }
    const userRepo: IUserRepository = RepositoryFactory.getUserRepository();
    const user = await userRepo.getUserByEmail(this.appContext.getClient(), userEmail);
    if (!user) {
      throw new AppException(UserErrorMessages.USERS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user.email);
    const newRefreshTokenHash = createHashForRefreshToken(refreshToken);

    await redisCache.getClient().set(newRefreshTokenHash, user.email, 'EX', 8 * 60 * 60);
    await redisCache.getClient().del(refreshTokenHash);

    return { accessToken, refreshToken };
  }
}
