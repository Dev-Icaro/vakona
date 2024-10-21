import { container } from '@common/ioc/inversify.config';
import TYPES from '@common/ioc/types';
import UserRepositoryMock from '../../infra/repositories/UserRepositoryMock';
import IUserRepository from '@modules/user/infra/interfaces/IUserRepository';
import UpdateUserService from '@modules/user/application/services/UpdateUserService';
import IUpdateUserDTO from '@modules/user/domain/dtos/IUpdateUserDTO';
import AppException from '@common/exceptions/AppException';
import { ConflictException } from '@common/exceptions/HttpExceptions';
import { UserErrorMessages } from '@modules/user/domain/error-messages/UserErrorMessages';
import AppContext from '@common/utils/AppContext';
import Helpers from '@common/utils/Helpers';
import bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '@common/utils/systemConstants';
import IUser from '@modules/user/domain/models/IUser';

container.rebind<IUserRepository>(TYPES.IUserRepository).to(UserRepositoryMock).inSingletonScope();

describe('#UpdateUserService Test Suite', () => {
  const appContext = new AppContext();
  const updateUserService = new UpdateUserService(appContext);
  const updateUserInputMock: IUpdateUserDTO = {
    userId: 1,
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
    const updateUserInput = {
      ...updateUserInputMock,
      phoneNumber: '1111',
    };

    expect(updateUserService.execute(updateUserInput)).rejects.toStrictEqual(expectedReject);
  });

  it('should throw if a wrong email is provided', async () => {
    const expectedReject = new AppException('Email inválido');
    const updateUserInput = {
      ...updateUserInputMock,
      email: 'wrong email',
    };

    await expect(updateUserService.execute(updateUserInput)).rejects.toStrictEqual(expectedReject);
  });

  it('should throw if user by email alredy exists', async () => {
    const userByEmailMock: IUser = {
      ...updateUserInputMock,
      password: 'test',
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(UserRepositoryMock.prototype, 'existsByEmail').mockResolvedValueOnce(true);
    jest
      .spyOn(UserRepositoryMock.prototype, 'getUserByEmail')
      .mockResolvedValueOnce(userByEmailMock);

    const expectedReject = new ConflictException(
      Helpers.formatErrorMessage(UserErrorMessages.USER_WITH_EMAIL_ALREADY_EXISTS, [
        updateUserInputMock.email,
      ]),
    );

    await expect(updateUserService.execute(updateUserInputMock)).rejects.toStrictEqual(
      expectedReject,
    );
  });

  it('should hash password correctly', async () => {
    const updateUserInput: IUpdateUserDTO = {
      userId: 1,
      activeInd: true,
      cep: '12356',
      cpf: '123456',
      email: 'admin@admin.com',
      name: 'admin',
      password: '123456',
      phoneNumber: '5511991234567',
    };

    jest.spyOn(UserRepositoryMock.prototype, 'existsByEmail').mockResolvedValueOnce(false);
    jest.spyOn(bcrypt, 'hash');

    await updateUserService.execute(updateUserInput);

    expect(bcrypt.hash).toHaveBeenCalledWith('123456', BCRYPT_SALT_ROUNDS);
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
  });

  it('should resolve and update user', async () => {
    jest.spyOn(UserRepositoryMock.prototype, 'existsByEmail').mockResolvedValueOnce(false);
    await expect(updateUserService.execute(updateUserInputMock)).resolves;
  });
});
