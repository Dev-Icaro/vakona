import IAuthUseCases from '@modules/user/domain/use-cases/IAuthUseCases';
import IAuthDTO from '@modules/user/domain/dtos/IAuthDTO';
import LoginService from '../services/LoginService';
import ITokenInfo from '@modules/user/domain/models/ITokenInfo';
import RefreshService from '../services/RefreshService';
import LogoutService from '../services/LogoutService';
import { injectable } from 'inversify';
import ServiceExecutor from '@common/utils/ServiceExecutor';

export default
@injectable()
class AuthUseCasesImpl implements IAuthUseCases {
  async login(authDTO: IAuthDTO): Promise<ITokenInfo> {
    return ServiceExecutor.execute<ITokenInfo>(LoginService, authDTO);
  }

  async refresh(refreshTokenHash: string): Promise<ITokenInfo> {
    return ServiceExecutor.execute<ITokenInfo>(RefreshService, refreshTokenHash);
  }

  async logout(refreshTokenHash: string): Promise<void> {
    ServiceExecutor.execute<void>(LogoutService, refreshTokenHash);
  }
}
