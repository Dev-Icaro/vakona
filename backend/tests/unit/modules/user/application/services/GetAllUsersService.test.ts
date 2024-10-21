import { container } from '@common/ioc/inversify.config';
import TYPES from '@common/ioc/types';
import IUserRepository from '@modules/user/infra/interfaces/IUserRepository';
import UserRepositoryMock from '../../infra/repositories/UserRepositoryMock';
import IUser from '@modules/user/domain/models/IUser';
import { NotFoundException } from '@common/exceptions/HttpExceptions';
import { UserErrorMessages } from '@modules/user/domain/error-messages/UserErrorMessages';
import AppContext from '@common/utils/AppContext';
import GetAllUsersService from '@modules/user/application/services/GetAllUsersService';
import IPaginationParams from '@common/interfaces/IPaginationParams';
import IUserPaginateDTO from '@modules/user/domain/dtos/IUserPaginateDTO';

container.rebind<IUserRepository>(TYPES.IUserRepository).to(UserRepositoryMock).inSingletonScope();

describe('#GetAllUserService Test Suite', () => {
  const usersMock: IUser[] = [
    {
      userId: 1,
      activeInd: false,
      cep: '1235',
      cpf: '12345678988',
      email: 'admin@admin.com',
      name: 'admin',
      password: 'teste',
      createdAt: new Date(0),
      updatedAt: null,
      phoneNumber: '12345689',
    },
  ];

  const appContext = new AppContext();
  const getAllUsersService = new GetAllUsersService(appContext);
  const mockPaginationParams: IPaginationParams = {
    orderBy: null,
    perPage: 1,
    page: 10,
  };

  it('should throw if no users are found', async () => {
    jest.spyOn(UserRepositoryMock.prototype, 'getAllUsers').mockResolvedValue(null);
    const expectedReject = new NotFoundException(UserErrorMessages.USERS_NOT_FOUND);
    await expect(getAllUsersService.execute(mockPaginationParams)).rejects.toStrictEqual(
      expectedReject,
    );
  });

  it('should return all users', async () => {
    jest.spyOn(UserRepositoryMock.prototype, 'getAllUsers').mockResolvedValue(usersMock);
    jest.spyOn(UserRepositoryMock.prototype, 'countUsers').mockResolvedValue(usersMock.length);

    const expectedUsersPaginated: IUserPaginateDTO = {
      currentPage: mockPaginationParams.page,
      perPage: mockPaginationParams.perPage,
      total: usersMock.length,
      data: usersMock.map(user => {
        return {
          userId: user.userId,
          activeInd: user.activeInd,
          cep: user.cep,
          cpf: user.cpf,
          email: user.email,
          name: user.name,
          phoneNumber: user.phoneNumber,
        };
      }),
    };

    await expect(getAllUsersService.execute(mockPaginationParams)).resolves.toStrictEqual(
      expectedUsersPaginated,
    );
  });
});
