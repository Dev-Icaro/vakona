import TYPES from '@common/ioc/types';
import IUserRepository from '@modules/user/infra/interfaces/IUserRepository';
import { container } from '@common/ioc/inversify.config';

/**
 * Factory class for creating instances of repository interfaces using dependency injection.
 */
class RepositoryFactory {
  /**
   * Get an instance of the user repository.
   *
   * @returns An instance of the user repository.
   */
  public getUserRepository(): IUserRepository {
    return container.get<IUserRepository>(TYPES.IUserRepository);
  }
}

export default new RepositoryFactory();
