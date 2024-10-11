import IPaginationParams from '@common/interfaces/IPaginationParams';
import IUserUseCases from '../../domain/use-cases/IUserUseCases';
import GetUserByIdService from '../services/GetUserByIdService';
import IUserDTO from '../../domain/dtos/IUserDTO';
import GetAllUsersService from '../services/GetAllUsersService';
import IUserPaginateDTO from '../../domain/dtos/IUserPaginateDTO';
import CreateUserService from '../services/CreateUserService';
import ICreateUserDTO from '../../domain/dtos/ICreateUserDTO';
import UpdateUserService from '../services/UpdateUserService';
import IUpdateUserDTO from '../../domain/dtos/IUpdateUserDTO';
import DeleteUserService from '../services/DeleteUserService';
import { injectable } from 'inversify';
import ServiceExecutor from '@common/utils/ServiceExecutor';

export default
@injectable()
class UserUseCasesImpl implements IUserUseCases {
  async getUserById(userId: number): Promise<IUserDTO> {
    return ServiceExecutor.execute<IUserDTO>(GetUserByIdService, userId);
  }

  async getAllUsers(paginationParams: IPaginationParams): Promise<IUserPaginateDTO> {
    return ServiceExecutor.execute<IUserPaginateDTO>(GetAllUsersService, paginationParams);
  }

  async createUser(createUserDTO: ICreateUserDTO): Promise<void> {
    await ServiceExecutor.execute<void>(CreateUserService, createUserDTO);
  }

  async updateUser(updateUserDTO: IUpdateUserDTO): Promise<void> {
    await ServiceExecutor.execute<void>(UpdateUserService, updateUserDTO);
  }

  async deleteUser(userId: number): Promise<void> {
    await ServiceExecutor.execute<void>(DeleteUserService, userId);
  }
}
