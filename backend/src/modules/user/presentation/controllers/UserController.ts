import TYPES from '@common/ioc/types';
import Helpers from '@common/utils/Helpers';
import { HttpStatus } from '@common/utils/systemConstants';
import IUserUseCases from '@modules/user/domain/use-cases/IUserUseCases';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

export default
@injectable()
class UserController {
  constructor(@inject(TYPES.IUserUseCases) private readonly userUseCases: IUserUseCases) {}

  public async getById(request: Request, response: Response): Promise<Response> {
    const userId = parseInt(request.params.id);
    const userDTO = await this.userUseCases.getUserById(userId);
    return response.json(userDTO);
  }

  public async getAll(request: Request, response: Response): Promise<Response> {
    const paginationParams = Helpers.extractPaginationParamsFromRequest(request);
    const usersPaginated = await this.userUseCases.getAllUsers(paginationParams);
    return response.json(usersPaginated);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    await this.userUseCases.createUser(request.body);
    return response.status(HttpStatus.NO_CONTENT).send();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    await this.userUseCases.updateUser({
      userId: parseInt(request.params.id),
      ...request.body,
    });
    return response.status(HttpStatus.NO_CONTENT).send();
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const userId = parseInt(request.params.id);
    await this.userUseCases.deleteUser(userId);
    return response.status(HttpStatus.NO_CONTENT).send();
  }
}
