import IService from '@common/interfaces/IService';
import AppContext from '@common/utils/AppContext';
import InputValidator from '@common/utils/InputValidator';
import Helpers from '@common/utils/Helpers';
import { BCRYPT_SALT_ROUNDS } from '@common/utils/systemConstants';
import ICreateUserDTO from '@modules/user/domain/dtos/ICreateUserDTO';
import IUserRepository from '@modules/user/infra/interfaces/IUserRepository';
import { UserErrorMessages } from '../../domain/error-messages/UserErrorMessages';
import bcrypt from 'bcrypt';
import RepositoryFactory from '@common/utils/RepositoryFactory';
import { ConflictException } from '@common/exceptions/HttpExceptions';

/**
 * Service class for creating a new user.
 */
export default class CreateUserService implements IService<void> {
  constructor(private readonly appContext: AppContext) {}

  /**
   * Executes the logic for creating a new user.
   *
   * @param createUserDTO - The data for creating the user.
   * @returns A Promise that resolves when the user is successfully created.
   * @throws - {@link AppException} - If there are input validation errors or the user already exists.
   */
  public async execute(createUserDTO: ICreateUserDTO): Promise<void> {
    this.validateInput(createUserDTO);
    const userRepo: IUserRepository = RepositoryFactory.getUserRepository();

    const existsByEmail = await userRepo.existsByEmail(
      this.appContext.getClient(),
      createUserDTO.email,
    );

    if (existsByEmail) {
      throw new ConflictException(
        Helpers.formatErrorMessage(UserErrorMessages.USER_WITH_EMAIL_ALREADY_EXISTS, [
          createUserDTO.email,
        ]),
      );
    } else {
      createUserDTO.password = await bcrypt.hash(createUserDTO.password, BCRYPT_SALT_ROUNDS);
      await userRepo.createUser(this.appContext.getClient(), createUserDTO);
    }
  }

  private validateInput(createUserDTO: ICreateUserDTO): void {
    InputValidator.validateEmail(createUserDTO.email);

    if (createUserDTO.phoneNumber) {
      InputValidator.validatePhoneNumber(createUserDTO.phoneNumber);
    }
  }
}
