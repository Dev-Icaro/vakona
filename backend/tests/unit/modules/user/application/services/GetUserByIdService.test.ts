import { container } from '@common/ioc/inversify.config';
import TYPES from '@common/ioc/types';
import UserRepositoryMock from '../../infra/repositories/UserRepositoryMock';
import IUserRepository from '@modules/user/infra/interfaces/IUserRepository';
import AppContext from '@common/utils/AppContext';
import GetUserByIdService from '@modules/user/application/services/GetUserByIdService';
import IUserDTO from '@modules/user/domain/dtos/IUserDTO';
import { NotFoundException } from '@common/exceptions/HttpExceptions';
import Helpers from '@common/utils/Helpers';
import { UserErrorMessages } from '@modules/user/domain/error-messages/UserErrorMessages';

container.rebind<IUserRepository>(TYPES.IUserRepository).to(UserRepositoryMock).inSingletonScope();

const appContext = new AppContext();
const getUserByIdService = new GetUserByIdService(appContext);

const user: IUserDTO = {
  userId: 1,
  name: 'Test User',
  email: 'user@gmail.com',
  phoneNumber: '123456789',
  activeInd: true,
  cpf: '123456456',
  cep: '04330060',
};

test('should return user', async () => {
  const userOutput = await getUserByIdService.execute(1);
  expect(JSON.stringify(user)).toStrictEqual(JSON.stringify(userOutput));
});

test('should throw an error', async () => {
  const expectedReject = new NotFoundException(
    Helpers.formatErrorMessage(UserErrorMessages.USER_NOT_FOUND, [2]),
  );
  await expect(getUserByIdService.execute(2)).rejects.toStrictEqual(expectedReject);
});
