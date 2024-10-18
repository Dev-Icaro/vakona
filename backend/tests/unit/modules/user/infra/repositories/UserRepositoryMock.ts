/* eslint-disable @typescript-eslint/no-unused-vars */
import { PoolClient } from 'pg';
import { injectable } from 'inversify';
import IUserRepository from '@modules/user/infra/interfaces/IUserRepository';
import IPaginationParams from '@common/interfaces/IPaginationParams';
import ICreateUserDTO from '@modules/user/domain/dtos/ICreateUserDTO';
import IUpdateUserDTO from '@modules/user/domain/dtos/IUpdateUserDTO';
import IUser from '@modules/user/domain/models/IUser';

export default
@injectable()
class UserRepositoryMock implements IUserRepository {
  private users: IUser[] = [
    {
      userId: 1,
      name: 'Test User',
      email: 'user@gmail.com',
      password: '12345',
      phoneNumber: '123456789',
      activeInd: true,
      createdAt: new Date(0),
      updatedAt: new Date(0),
      cep: '04330060',
      cpf: '123456456',
    },
    {
      userId: 3,
      name: 'Test User 2',
      email: 'user@gmail.com',
      password: '12345',
      phoneNumber: '123456789',
      activeInd: true,
      cep: '04330060',
      cpf: '123456456',
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
  ];

  countUsers(client: PoolClient): Promise<number> {
    throw new Error('Method not implemented.');
  }

  async getUserById(client: PoolClient, userId: number): Promise<IUser> {
    return this.users.find(user => user.userId === userId) || null;
  }

  getAllUsers(client: PoolClient, paginationParams: IPaginationParams): Promise<IUser[]> {
    throw new Error('Method not implemented.');
  }

  createUser(client: PoolClient, user: ICreateUserDTO): Promise<void> {
    throw new Error('Method not implemented.');
  }

  updateUser(client: PoolClient, user: IUpdateUserDTO): Promise<void> {
    throw new Error('Method not implemented.');
  }

  deleteUser(client: PoolClient, userId: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  existsByEmail(client: PoolClient, email: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  existsByPhoneNumber(client: PoolClient, phoneNumber: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  getUserByEmail(client: PoolClient, email: string): Promise<IUser> {
    throw new Error('Method not implemented.');
  }

  getUserByPhoneNumber(client: PoolClient, phoneNumber: string): Promise<IUser> {
    throw new Error('Method not implemented.');
  }

  existsById(client: PoolClient, userId: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
