import AppException from '@common/exceptions/AppException';
import IService from '@common/interfaces/IService';
import AppContext from '@common/utils/AppContext';
import { HttpStatus } from '@common/utils/systemConstants';
import IUserRepository from '@modules/user/infra/interfaces/IUserRepository';
import { UserErrorMessages } from '../../domain/error-messages/UserErrorMessages';
import IAuthDTO from '@modules/user/domain/dtos/IAuthDTO';
import bcrypt from 'bcrypt';
import ITokenInfo from '@modules/user/domain/models/ITokenInfo';
import { createAccessToken, createHashForRefreshToken, createRefreshToken } from '../utils/authUtils';
import { AuthErrorMessages } from '@modules/user/domain/error-messages/AuthErrorMessages';
import redisCache from '@common/cache/RedisCache';
import RepositoryFactory from '@common/utils/RepositoryFactory';

/**
 * Service class for handling user login.
 */
export default class LoginService implements IService<ITokenInfo> {
  constructor(private readonly appContext: AppContext) {}

  /**
   * Executes the logic for user login.
   *
   * @param authDTO - The authentication data.
   * @returns A Promise that resolves with the token information.
   * @throws If the credentials are invalid, the user is inactive, or the user is not found.
   */
  public async execute(authDTO: IAuthDTO): Promise<ITokenInfo> {
    const userRepo: IUserRepository = RepositoryFactory.getUserRepository();
    const user = await userRepo.getUserByEmail(this.appContext.getClient(), authDTO.email);
    if (user) {
      if (!bcrypt.compareSync(authDTO.password, user.password)) {
        throw new AppException(AuthErrorMessages.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
      }

      if (user.activeInd === false) {
        throw new AppException(UserErrorMessages.USER_INACTIVE, HttpStatus.UNAUTHORIZED);
      }

      const accessToken = createAccessToken(user);
      const refreshToken = createRefreshToken(user.email);
      const refreshTokenHash = createHashForRefreshToken(refreshToken);

      await redisCache.getClient().set(refreshTokenHash, user.email, 'EX', 8 * 60 * 60);

      return { accessToken, refreshToken, user: { userId: user.userId, email: user.email, name: user.name } };
    } else {
      throw new AppException(UserErrorMessages.USERS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }
}
