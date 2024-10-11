import { PoolClient } from 'pg';
import IUser from '@modules/user/domain/models/IUser';
import ICreateUserDTO from '@modules/user/domain/dtos/ICreateUserDTO';
import IUpdateUserDTO from '@modules/user/domain/dtos/IUpdateUserDTO';
import IPaginationParams from '@common/interfaces/IPaginationParams';

/**
 * Interface representing user-related database operations.
 */
export default interface IUserRepository {
  /**
   * Counts the number of users.
   * @param client - The PostgreSQL client.
   * @returns A promise that resolves to the number of users.
   */
  countUsers(client: PoolClient): Promise<number>;

  /**
   * Retrieves a user by their unique identifier.
   * @param client - The PostgreSQL client.
   * @param userId - The unique identifier of the user.
   * @returns A promise that resolves to the user data.
   */
  getUserById(client: PoolClient, userId: number): Promise<IUser>;

  /**
   * Retrieves a paginated list of all users.
   * @param client - The PostgreSQL client.
   * @param paginationParams - Parameters for paginating the results.
   * @returns A promise that resolves to the paginated user data.
   */
  getAllUsers(client: PoolClient, paginationParams: IPaginationParams): Promise<IUser[]>;

  /**
   * Creates a new user.
   * @param client - The PostgreSQL client.
   * @param user - The data required to create a new user.
   * @returns A promise that resolves once the user is successfully created.
   */
  createUser(client: PoolClient, user: ICreateUserDTO): Promise<void>;

  /**
   * Updates an existing user.
   * @param client - The PostgreSQL client.
   * @param user - The data required to update an existing user.
   * @returns A promise that resolves once the user is successfully updated.
   */
  updateUser(client: PoolClient, user: IUpdateUserDTO): Promise<void>;

  /**
   * Deletes a user by their unique identifier.
   * @param client - The PostgreSQL client.
   * @param userId - The unique identifier of the user to be deleted.
   * @returns A promise that resolves once the user is successfully deleted.
   */
  deleteUser(client: PoolClient, userId: number): Promise<void>;

  /**
   * Checks if a user with the given email exists.
   * @param client - The PostgreSQL client.
   * @param email - The email to check for existence.
   * @returns A promise that resolves to a boolean indicating whether the email exists.
   */
  existsByEmail(client: PoolClient, email: string): Promise<boolean>;

  /**
   * Checks if a user with the given phone number exists.
   * @param client - The PostgreSQL client.
   * @param phoneNumber - The phone number to check for existence.
   * @returns A promise that resolves to a boolean indicating whether the phone number exists.
   */
  existsByPhoneNumber(client: PoolClient, phoneNumber: string): Promise<boolean>;

  /**
   * Retrieves a user by their email address.
   * @param client - The PostgreSQL client.
   * @param email - The email address of the user.
   * @returns A promise that resolves to the user data.
   */
  getUserByEmail(client: PoolClient, email: string): Promise<IUser>;

  /**
   * Retrieves a user by their phone number.
   * @param client - The PostgreSQL client.
   * @param phoneNumber - The phone number of the user.
   * @returns A promise that resolves to the user data.
   */
  getUserByPhoneNumber(client: PoolClient, phoneNumber: string): Promise<IUser>;

  /**
   * Checks if a user with the given ID exists.
   * @param client - The PostgreSQL client.
   * @param userId - The unique identifier of the user.
   * @returns A promise that resolves to a boolean indicating whether the user exists.
   */
  existsById(client: PoolClient, userId: number): Promise<boolean>;
}
