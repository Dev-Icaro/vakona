import AppContext from '@common/utils/AppContext';
import IService from '@common/interfaces/IService';

/**
 * Utility class for executing services within a transactional context.
 */
export default class ServiceExecutor {
  /**
   * Private constructor to prevent instantiation of the ServiceExecutor class.
   * @throws - {@link Error}
   * Throws an error with a message indicating that the ServiceExecutor class cannot be instantiated.
   */
  private constructor() {
    throw new Error('ServiceExecutor class cannot be instantiated.');
  }

  /**
   * Executes a service within a transactional context.
   *
   * @remarks
   *
   * This method creates an instance of the service to be executed, begins a transaction,
   * executes the service, commits the transaction, and releases the connection.
   * If an error occurs during the execution of the service, the transaction is rolled back.
   * The service must implement the {@link IService} interface.
   * The service constructor must accept an {@link AppContext} parameter.
   *
   * @param serviceConstructor - The constructor function of the service to be executed.
   * @param args - Arguments to be passed to the service's execute method.
   * @returns A Promise that resolves to the result of the service execution.
   */
  public static async execute<T>(
    serviceConstructor: new (context: AppContext) => IService<T>,
    ...args: any[]
  ): Promise<T> {
    const appContext = new AppContext();
    try {
      await appContext.beginTransaction();
      const service = new serviceConstructor(appContext);
      const result: T = await service.execute(...args);
      await appContext.commit();
      return result;
    } catch (e) {
      await appContext.rollback();
      throw e;
    } finally {
      await appContext.release();
    }
  }
}
