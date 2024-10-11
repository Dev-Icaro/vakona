import AppException from '@common/exceptions/AppException';
import IService from '@common/interfaces/IService';
import AppContext from '@common/utils/AppContext';
import Helpers from '@common/utils/Helpers';
import { HttpStatus } from '@common/utils/systemConstants';
import IUserDTO from '@modules/user/domain/dtos/IUserDTO';
import IUserRepository from '@modules/user/infra/interfaces/IUserRepository';
import { UserErrorMessages } from '../../domain/error-messages/UserErrorMessages';
import RepositoryFactory from '@common/utils/RepositoryFactory';
import UserMapper from '../utils/UserMapper';

/**
 * Service class for retrieving a user by ID.
 */
export default class GetUserByIdService implements IService<IUserDTO> {
  constructor(private readonly appContext: AppContext) {}

  /**
   * Executes the logic for retrieving a user by ID.
   *
   * @param userId - The ID of the user to retrieve.
   * @returns A Promise that resolves with the user information.
   * @throws If the user is not found.
   */
  public async execute(userId: number): Promise<IUserDTO> {
    const userRepo: IUserRepository = RepositoryFactory.getUserRepository();
    const user = await userRepo.getUserById(this.appContext.getClient(), userId);
    if (user) {
      return UserMapper.modelToDTO(user);
    } else {
      throw new AppException(
        Helpers.formatErrorMessage(UserErrorMessages.USER_NOT_FOUND, [userId]),
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
