import AppException from '@common/exceptions/AppException';
import IService from '@common/interfaces/IService';
import AppContext from '@common/utils/AppContext';
import InputValidator from '@common/utils/InputValidator';
import Helpers from '@common/utils/Helpers';
import { BCRYPT_SALT_ROUNDS, HttpStatus } from '@common/utils/systemConstants';
import IUpdateUserDTO from '@modules/user/domain/dtos/IUpdateUserDTO';
import IUserRepository from '@modules/user/infra/interfaces/IUserRepository';
import { UserErrorMessages } from '../../domain/error-messages/UserErrorMessages';
import bcrypt from 'bcrypt';
import RepositoryFactory from '@common/utils/RepositoryFactory';
import { ConflictException } from '@common/exceptions/HttpExceptions';

/**
 * Service class for updating user information.
 */
export default class UpdateUserService implements IService<void> {
  constructor(private readonly appContext: AppContext) {}

  /**
   * Executes the logic for updating user information.
   *
   * @param updateUserDTO - The data for updating the user.
   * @returns A Promise that resolves with no value when the update is successful.
   * @throws - {@link AppException} When the user to be updated is not found, or when there are conflicts with existing users.
   */
  public async execute(updateUserDTO: IUpdateUserDTO): Promise<void> {
    this.validateInput(updateUserDTO);
    const userRepo: IUserRepository = RepositoryFactory.getUserRepository();

    const user = await userRepo.getUserById(this.appContext.getClient(), updateUserDTO.userId);
    if (!user) {
      throw new AppException(
        Helpers.formatErrorMessage(UserErrorMessages.USER_NOT_FOUND, [updateUserDTO.userId]),
        HttpStatus.NOT_FOUND,
      );
    }

    const userByEmail = await userRepo.getUserByEmail(
      this.appContext.getClient(),
      updateUserDTO.email,
    );

    if (userByEmail && user.userId !== userByEmail.userId) {
      throw new ConflictException(
        Helpers.formatErrorMessage(UserErrorMessages.USER_WITH_EMAIL_ALREADY_EXISTS, [
          updateUserDTO.email,
        ]),
      );
    }

    updateUserDTO.password = await bcrypt.hash(updateUserDTO.password, BCRYPT_SALT_ROUNDS);
    await userRepo.updateUser(this.appContext.getClient(), updateUserDTO);
  }

  private validateInput(updateUserDTO: IUpdateUserDTO): void {
    InputValidator.validateEmail(updateUserDTO.email);

    if (updateUserDTO.phoneNumber) {
      InputValidator.validatePhoneNumber(updateUserDTO.phoneNumber);
    }
  }
}
