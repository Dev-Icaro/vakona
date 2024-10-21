import IPaginationParams from '@common/interfaces/IPaginationParams';
import IService from '@common/interfaces/IService';
import AppContext from '@common/utils/AppContext';
import RepositoryFactory from '@common/utils/RepositoryFactory';
import IUserPaginateDTO from '@modules/user/domain/dtos/IUserPaginateDTO';
import IUserRepository from '@modules/user/infra/interfaces/IUserRepository';
import { UserErrorMessages } from '../../domain/error-messages/UserErrorMessages';
import UserMapper from '../utils/UserMapper';
import { NotFoundException } from '@common/exceptions/HttpExceptions';

/**
 * Service class for retrieving all users with pagination.
 */
export default class GetAllUsersService implements IService<IUserPaginateDTO> {
  constructor(private readonly appContext: AppContext) {}

  /**
   * Executes the logic for retrieving all users with pagination.
   *
   * @param paginationParams - The pagination parameters.
   * @returns A Promise that resolves with a paginated list of users.
   * @throws If no users are found.
   */
  public async execute(paginationParams: IPaginationParams): Promise<IUserPaginateDTO> {
    const userRepo: IUserRepository = RepositoryFactory.getUserRepository();
    const users = await userRepo.getAllUsers(this.appContext.getClient(), paginationParams);
    const totalUsersCount = await userRepo.countUsers(this.appContext.getClient());
    if (users && users.length > 0) {
      return {
        perPage: paginationParams.perPage,
        total: totalUsersCount,
        currentPage: paginationParams.page,
        data: users.map(user => {
          return UserMapper.modelToDTO(user);
        }),
      };
    } else {
      throw new NotFoundException(UserErrorMessages.USERS_NOT_FOUND);
    }
  }
}
