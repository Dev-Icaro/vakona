import { container } from '@common/ioc/inversify.config';
import TYPES from '@common/ioc/types';
import IUserRepository from '@modules/user/infra/interfaces/IUserRepository';
import UserRepositoryMock from '../../infra/repositories/UserRepositoryMock';
import CreateUserService from '@modules/user/application/services/CreateUserService';
import AppContext from '@common/utils/AppContext';
import ICreateUserDTO from '@modules/user/domain/dtos/ICreateUserDTO';
import { ConflictException } from '@common/exceptions/HttpExceptions';
import Helpers from '@common/utils/Helpers';
import { UserErrorMessages } from '@modules/user/domain/error-messages/UserErrorMessages';
import AppException from '@common/exceptions/AppException';
import bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '@common/utils/systemConstants';

container.rebind<IUserRepository>(TYPES.IUserRepository).to(UserRepositoryMock).inSingletonScope();

describe('#CreateUserService Test Suite', () => {
  const appContext = new AppContext();
  const createUserService = new CreateUserService(appContext);
  const createUserInputMock: ICreateUserDTO = {
    activeInd: true,
    cep: '12356',
    cpf: '123456',
    email: 'admin@admin.com',
    name: 'admin',
    password: '123456',
    phoneNumber: '5511991234567',
  };

  it('should throw if a wrong phone number is provided', async () => {
    const expectedReject = new AppException('Número de celular/telefone inválido');
    const createUserInput = {
      ...createUserInputMock,
      phoneNumber: '1111',
    };

    expect(createUserService.execute(createUserInput)).rejects.toStrictEqual(expectedReject);
  });

  it('should throw if a wrong email is provided', async () => {
    const expectedReject = new AppException('Email inválido');
    const createUserInput = {
      ...createUserInputMock,
      email: 'wrong email',
    };

    await expect(createUserService.execute(createUserInput)).rejects.toStrictEqual(expectedReject);
  });

  it('should throw if user by email alredy exists', async () => {
    jest.spyOn(UserRepositoryMock.prototype, 'existsByEmail').mockResolvedValueOnce(true);

    const expectedReject = new ConflictException(
      Helpers.formatErrorMessage(UserErrorMessages.USER_WITH_EMAIL_ALREADY_EXISTS, [
        createUserInputMock.email,
      ]),
    );

    await expect(createUserService.execute(createUserInputMock)).rejects.toStrictEqual(
      expectedReject,
    );
  });

  it('should hash password correctly', async () => {
    jest.spyOn(UserRepositoryMock.prototype, 'existsByEmail').mockResolvedValueOnce(false);
    jest.spyOn(bcrypt, 'hash');

    await createUserService.execute(createUserInputMock);

    expect(bcrypt.hash).toHaveBeenCalledWith('123456', BCRYPT_SALT_ROUNDS);
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
  });

  it('should resolve and create user', async () => {
    jest.spyOn(UserRepositoryMock.prototype, 'existsByEmail').mockResolvedValueOnce(false);
    await expect(createUserService.execute(createUserInputMock)).resolves;
  });
});
