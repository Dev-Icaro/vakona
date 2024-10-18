import IPaginationParams from '@common/interfaces/IPaginationParams';
import { PoolClient } from 'pg';
import Helpers from '@common/utils/Helpers';
import IUser from '@modules/user/domain/models/IUser';
import ICreateUserDTO from '@modules/user/domain/dtos/ICreateUserDTO';
import IUpdateUserDTO from '@modules/user/domain/dtos/IUpdateUserDTO';
import IUserRepository from '@modules/user/infra/interfaces/IUserRepository';
import { injectable } from 'inversify';
import UserMapper from '@modules/user/application/utils/UserMapper';

export default
@injectable()
class UserRepositoryImpl implements IUserRepository {
  async countUsers(client: PoolClient): Promise<number> {
    const totalCountResult = await client.query('SELECT COUNT(*) AS TOTAL_COUNT FROM USERS');
    return parseInt(totalCountResult.rows[0].total_count);
  }

  async getUserById(client: PoolClient, userId: number): Promise<IUser> {
    const result = await client.query(
      `
      SELECT * FROM USERS WHERE USER_ID = $1
      `,
      [userId],
    );
    if (result.rows[0]) {
      const user = result.rows[0];
      return UserMapper.rowToModel(user);
    } else {
      return null;
    }
  }

  async getAllUsers(client: PoolClient, paginationParams: IPaginationParams): Promise<IUser[]> {
    const orderByClauses = Helpers.generateOrderByClauses(paginationParams.orderBy);
    const result = await client.query(
      `
      SELECT * FROM USERS
      ${orderByClauses.length > 0 ? `ORDER BY ${orderByClauses.join(', ')}` : ''}
      LIMIT $1 OFFSET $2
      `,
      [paginationParams.perPage, paginationParams.perPage * paginationParams.page],
    );
    if (result.rows.length > 0) {
      const users: IUser[] = [];
      result.rows.forEach(user => {
        users.push(UserMapper.rowToModel(user));
      });
      return users;
    } else {
      return null;
    }
  }

  async createUser(client: PoolClient, user: ICreateUserDTO): Promise<void> {
    await client.query(
      `
      INSERT INTO USERS (NAME, EMAIL, PASSWORD, PHONE_NUMBER, ACTIVE_IND, CREATED_AT)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [user.name, user.email, user.password, user.phoneNumber, user.activeInd, new Date()],
    );
  }

  async updateUser(client: PoolClient, user: IUpdateUserDTO): Promise<void> {
    await client.query(
      `
      UPDATE USERS SET
        NAME = $1,
        EMAIL = $2,
        PASSWORD = $3,
        PHONE_NUMBER = $4,
        ACTIVE_IND = $5,
        UPDATED_AT = $6
        WHERE USER_ID = $7
      `,
      [user.name, user.email, user.password, user.phoneNumber, user.activeInd, new Date(), user.userId],
    );
  }

  async deleteUser(client: PoolClient, userId: number): Promise<void> {
    await client.query(
      `
      DELETE FROM USERS WHERE USER_ID = $1
      `,
      [userId],
    );
  }

  async existsByEmail(client: PoolClient, email: string): Promise<boolean> {
    const existsResult = await client.query(
      `SELECT EXISTS(
        SELECT 1 FROM USERS
        WHERE EMAIL = $1
        )`,
      [email],
    );
    return existsResult.rows[0].exists;
  }

  async existsByPhoneNumber(client: PoolClient, phoneNumber: string): Promise<boolean> {
    const existsResult = await client.query(
      `SELECT EXISTS(
        SELECT 1 FROM USERS
        WHERE PHONE_NUMBER = $1
        )`,
      [phoneNumber],
    );
    return existsResult.rows[0].exists;
  }

  async getUserByEmail(client: PoolClient, email: string): Promise<IUser> {
    const result = await client.query(`SELECT * FROM USERS WHERE EMAIL = $1`, [email]);
    if (result.rows[0]) {
      const user = result.rows[0];
      return UserMapper.rowToModel(user);
    } else {
      return null;
    }
  }

  async getUserByPhoneNumber(client: PoolClient, phoneNumber: string): Promise<IUser> {
    const result = await client.query(`SELECT * FROM USERS WHERE PHONE_NUMBER = $1`, [phoneNumber]);
    if (result.rows[0]) {
      const user = result.rows[0];
      return UserMapper.rowToModel(user);
    } else {
      return null;
    }
  }

  async existsById(client: PoolClient, userId: number): Promise<boolean> {
    const existsResult = await client.query(
      `SELECT EXISTS(
        SELECT 1 FROM USERS
        WHERE USER_ID = $1
      )`,
      [userId],
    );
    return existsResult.rows[0].exists;
  }
}
