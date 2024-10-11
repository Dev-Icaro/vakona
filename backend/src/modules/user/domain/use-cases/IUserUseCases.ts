import IPaginationParams from '@common/interfaces/IPaginationParams';
import IUserDTO from '../dtos/IUserDTO';
import IUserPaginateDTO from '../dtos/IUserPaginateDTO';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IUpdateUserDTO from '../dtos/IUpdateUserDTO';

/**
 * Interface representing user-related use cases.
 */
export default interface IUserUseCases {
  /**
   * Retrieves a user by their unique identifier.
   * @param userId - The unique identifier of the user.
   * @returns A promise that resolves to the user data.
   */
  getUserById(userId: number): Promise<IUserDTO>;

  /**
   * Retrieves a paginated list of all users.
   * @param paginationParams - Parameters for paginating the results.
   * @returns A promise that resolves to the paginated user data.
   */
  getAllUsers(paginationParams: IPaginationParams): Promise<IUserPaginateDTO>;

  /**
   * Creates a new user.
   * @param createUserDTO - The data required to create a new user.
   * @returns A promise that resolves once the user is successfully created.
   */
  createUser(createUserDTO: ICreateUserDTO): Promise<void>;

  /**
   * Updates an existing user.
   * @param updateUserDTO - The data required to update an existing user.
   * @returns A promise that resolves once the user is successfully updated.
   */
  updateUser(updateUserDTO: IUpdateUserDTO): Promise<void>;

  /**
   * Deletes a user by their unique identifier.
   * @param userId - The unique identifier of the user to be deleted.
   * @returns A promise that resolves once the user is successfully deleted.
   */
  deleteUser(userId: number): Promise<void>;
}
