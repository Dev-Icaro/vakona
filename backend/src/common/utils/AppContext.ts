import { PoolClient } from 'pg';
import database from '@config/database';

/**
 * Represents the application context for database operations and data sharing between services.
 */
export default class AppContext {
  private client: PoolClient = null;
  public shared: any = null;
  private isInTransaction: boolean = false;

  /**
   * Creates a database connection if not already established.
   * @remarks If the connection is already open, this function does nothing.
   */
  public async createConnection() {
    if (!this.client) {
      this.client = await database.connect();
    }
  }

  /**
   * Retrieves the database client.
   * @returns The database client.
   */
  public getClient(): PoolClient {
    return this.client;
  }

  /**
   * Begins a database transaction.
   * @remarks If a transaction is already in progress, this function does nothing.
   * @throws - {@link Error} Throws an error if there is an issue starting the transaction.
   */
  public async beginTransaction(): Promise<void> {
    if (this.isInTransaction) {
      return;
    }
    await this.createConnection();
    this.isInTransaction = true;
    await this.client.query('BEGIN');
  }

  /**
   * Commits the current database transaction.
   * @remarks If no transaction is in progress, this function does nothing.
   * @throws - {@link Error} Throws an error if there is an issue committing the transaction.
   */
  public async commit(): Promise<void> {
    if (this.isInTransaction) {
      await this.client.query('COMMIT');
      this.isInTransaction = false;
    }
  }

  /**
   * Rolls back the current database transaction.
   * @remarks If no transaction is in progress, this function does nothing.
   * @throws - {@link Error} Throws an error if there is an issue rolling back the transaction.
   */
  public async rollback(): Promise<void> {
    if (this.isInTransaction) {
      await this.client.query('ROLLBACK');
      this.isInTransaction = false;
    }
  }

  /**
   * Releases the database client back to the pool.
   * @throws - {@link Error} Throws an error if there is an issue releasing the client.
   */
  public async release(): Promise<void> {
    this.client.release();
  }
}
