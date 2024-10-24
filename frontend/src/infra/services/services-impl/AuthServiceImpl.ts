import { IHttpClient } from '@/infra/http/HttpClient';
import IAuthService, { IAuthDTO, ITokenInfo } from '../interfaces/IAuthService';
import CoreApiExcpetion from '@/common/exceptions/CoreApiException';

export default class AuthServiceImpl implements IAuthService {
  constructor(private readonly httpClient: IHttpClient) {}

  async login(authDTO: IAuthDTO): Promise<ITokenInfo> {
    const response = await this.httpClient.request({
      method: 'POST',
      url: 'http://localhost:5000/auth/login',
      body: authDTO,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.statusCode !== 200) {
      throw new CoreApiExcpetion(response.body?.message, response?.statusCode);
    }

    return response.body as ITokenInfo;
  }
}
