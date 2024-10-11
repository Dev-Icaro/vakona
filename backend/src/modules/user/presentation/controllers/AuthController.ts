import TYPES from '@common/ioc/types';
import InputValidator from '@common/utils/InputValidator';
import { HttpStatus } from '@common/utils/systemConstants';
import IAuthUseCases from '@modules/user/domain/use-cases/IAuthUseCases';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import settings from '@config/settings.json';

export default
@injectable()
class AuthController {
  constructor(@inject(TYPES.IAuthUseCases) private readonly authUseCases: IAuthUseCases) {}

  public async login(request: Request, response: Response): Promise<Response> {
    let { email, password } = request.body;
    email = InputValidator.checkTypeAndAssign(email, { name: 'Email' });
    password = InputValidator.checkTypeAndAssign(password, { name: 'Senha' });
    const tokenInfo = await this.authUseCases.login({ email, password });
    response.cookie(settings.REFRESH_TOKEN_COOKIE_NAME, tokenInfo.refreshToken, {
      httpOnly: true,
      //secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + Number(settings.REFRESH_TOKEN_DURATION_MINUTES) * 60 * 1000),
    });
    return response.json({ accessToken: tokenInfo.accessToken, user: tokenInfo.user });
  }

  public async refresh(request: Request, response: Response): Promise<Response> {
    const tokenInfo = await this.authUseCases.refresh(response.locals.refreshTokenHash);
    response.cookie(settings.REFRESH_TOKEN_COOKIE_NAME, tokenInfo.refreshToken, {
      httpOnly: true,
      //secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + Number(settings.REFRESH_TOKEN_DURATION_MINUTES) * 60 * 1000),
    });
    return response.json({ accessToken: tokenInfo.accessToken });
  }

  public async logout(request: Request, response: Response): Promise<Response> {
    await this.authUseCases.logout(response.locals.refreshTokenHash);
    response.clearCookie(settings.REFRESH_TOKEN_COOKIE_NAME);
    return response.status(HttpStatus.NO_CONTENT).send();
  }
}
