import { Container } from 'inversify';
import TYPES from './types';
import UserRepositoryImpl from '@modules/user/infra/repositories/UserRepositoryImpl';
import UserUseCasesImpl from '@modules/user/application/use-cases-impl/UserUseCasesImpl';
import AuthUseCasesImpl from '@modules/user/application/use-cases-impl/AuthUseCasesImpl';

const container = new Container();

container.bind(TYPES.IUserRepository).to(UserRepositoryImpl).inSingletonScope();
container.bind(TYPES.IUserUseCases).to(UserUseCasesImpl).inSingletonScope();
container.bind(TYPES.IAuthUseCases).to(AuthUseCasesImpl).inSingletonScope();

export { container };
