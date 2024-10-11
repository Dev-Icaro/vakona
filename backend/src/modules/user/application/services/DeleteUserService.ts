import AppException from '@common/exceptions/AppException';
import IService from '@common/interfaces/IService';
import AppContext from '@common/utils/AppContext';
import Helpers from '@common/utils/Helpers';
import { HttpStatus } from '@common/utils/systemConstants';
import IUserRepository from '@modules/user/infra/interfaces/IUserRepository';
import { UserErrorMessages } from '../../domain/error-messages/UserErrorMessages';
import RepositoryFactory from '@common/utils/RepositoryFactory';

/**
 * Service class for deleting a user.
 */
export default class DeleteUserService implements IService<void> {
  constructor(private readonly appContext: AppContext) {}

  /**
   * Executes the logic for deleting a user.
   *
   * @param userId - The ID of the user to be deleted.
   * @returns A Promise that resolves when the user is successfully deleted.
   * @throws If the user is not found.
   */
  public async execute(userId: number): Promise<void> {
    const userRepo: IUserRepository = RepositoryFactory.getUserRepository();
    const exists = await userRepo.existsById(this.appContext.getClient(), userId);
    if (!exists) {
      throw new AppException(
        Helpers.formatErrorMessage(UserErrorMessages.USER_NOT_FOUND, [userId]),
        HttpStatus.NOT_FOUND,
      );
    }
    await userRepo.deleteUser(this.appContext.getClient(), userId);
  }
}
