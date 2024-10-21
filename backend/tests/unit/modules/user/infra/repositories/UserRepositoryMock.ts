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

  async countUsers(client: PoolClient): Promise<number> {
    return this.users.length;
  }

  async getUserById(client: PoolClient, userId: number): Promise<IUser> {
    return this.users.find(user => user.userId === userId) || null;
  }

  async getAllUsers(client: PoolClient, paginationParams: IPaginationParams): Promise<IUser[]> {
    const page = Math.max(paginationParams.page, 1);
    const startIndex = (page - 1) * paginationParams.perPage;
    const endIndex = startIndex + paginationParams.perPage;

    return this.users.slice(startIndex, endIndex);
  }

  async createUser(client: PoolClient, user: ICreateUserDTO): Promise<void> {
    this.users.push({
      ...user,
      userId: Math.floor(Math.random() * 1000),
      createdAt: new Date(0),
      updatedAt: null,
    });
  }

  async updateUser(client: PoolClient, user: IUpdateUserDTO): Promise<void> {
    const userIndex = this.users.findIndex(currUser => currUser.userId === user.userId);
    const userInDatabase = this.users[userIndex];

    if (userIndex < 0) {
      return;
    }

    this.users[userIndex] = {
      ...userInDatabase,
      updatedAt: new Date(),
      createdAt: userInDatabase.createdAt,
    };
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

  async getUserByEmail(client: PoolClient, email: string): Promise<IUser> {
    const user = this.users.find(user => user.email.toUpperCase() === email.toUpperCase());
    if (!user) {
      return null;
    }

    return user;
  }

  getUserByPhoneNumber(client: PoolClient, phoneNumber: string): Promise<IUser> {
    throw new Error('Method not implemented.');
  }

  existsById(client: PoolClient, userId: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
