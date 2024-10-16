import AppException from '@common/exceptions/AppException';
import IService from '@common/interfaces/IService';
import AppContext from '@common/utils/AppContext';
import InputValidator from '@common/utils/InputValidator';
import Helpers from '@common/utils/Helpers';
import { BCRYPT_SALT_ROUNDS, HttpStatus } from '@common/utils/systemConstants';
import ICreateUserDTO from '@modules/user/domain/dtos/ICreateUserDTO';
import IUserRepository from '@modules/user/infra/interfaces/IUserRepository';
import { UserErrorMessages } from '../../domain/error-messages/UserErrorMessages';
import bcrypt from 'bcrypt';
import RepositoryFactory from '@common/utils/RepositoryFactory';

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
    const contractor = await new GetContractorByIdService(this.appContext).execute(createUserDTO.contractorId);

    if (!contractor) {
      throw new AppException(
        Helpers.formatErrorMessage(ContractorErrorMessages.CONTRACTOR_NOT_FOUND, [createUserDTO.contractorId]),
        HttpStatus.NOT_FOUND,
      );
    }

    const existsByEmail = await userRepo.existsByEmail(this.appContext.getClient(), createUserDTO.email);
    const existsByPhoneNumber = await userRepo.existsByPhoneNumber(
      this.appContext.getClient(),
      createUserDTO.phoneNumber,
    );

    if (existsByEmail) {
      throw new AppException(
        Helpers.formatErrorMessage(UserErrorMessages.USER_WITH_EMAIL_ALREADY_EXISTS, [createUserDTO.email]),
      );
    } else if (existsByPhoneNumber) {
      throw new AppException(
        Helpers.formatErrorMessage(UserErrorMessages.USER_WITH_PHONE_ALREADY_EXISTS, [createUserDTO.phoneNumber]),
      );
    } else {
      createUserDTO.password = await bcrypt.hash(createUserDTO.password, BCRYPT_SALT_ROUNDS);
      await userRepo.createUser(this.appContext.getClient(), createUserDTO);
    }
  }

  private validateInput(createUserDTO: ICreateUserDTO): void {
    InputValidator.validateEmail(createUserDTO.email);
    InputValidator.validatePhoneNumber(createUserDTO.phoneNumber);

    if (createUserDTO.comission > 100 || createUserDTO.comission < 0) {
      throw new AppException(
        Helpers.formatErrorMessage(UserErrorMessages.INVALID_COMISSION_VALUE, [createUserDTO.comission]),
      );
    }
  }
}
