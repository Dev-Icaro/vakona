import TYPES from '@common/ioc/types';
import Helpers from '@common/utils/Helpers';
import InputValidator, { DataTypes } from '@common/utils/InputValidator';
import { HttpStatus } from '@common/utils/systemConstants';
import IUserUseCases from '@modules/user/domain/use-cases/IUserUseCases';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

export default
@injectable()
class UserController {
  constructor(@inject(TYPES.IUserUseCases) private readonly userUseCases: IUserUseCases) {}

  public async getById(request: Request, response: Response): Promise<Response> {
    let userId = Number(request.params.id);
    userId = InputValidator.checkTypeAndAssign(userId, {
      name: 'Id do usuário',
      varType: DataTypes.NUMBER,
    });
    const userDTO = await this.userUseCases.getUserById(userId);
    return response.json(userDTO);
  }

  public async getAll(request: Request, response: Response): Promise<Response> {
    const paginationParams = Helpers.extractPaginationParamsFromRequest(request);
    const usersPaginated = await this.userUseCases.getAllUsers(paginationParams);

    return response.json(usersPaginated);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    let { contractorId, name, email, password, phoneNumber, comission, observation, activeInd } = request.body;
    contractorId = InputValidator.checkTypeAndAssign(contractorId, {
      name: 'Id do contratante',
      varType: DataTypes.NUMBER,
    });
    name = InputValidator.checkTypeAndAssign(name, { name: 'Nome' });
    email = InputValidator.checkTypeAndAssign(email, { name: 'Email' });
    password = InputValidator.checkTypeAndAssign(password, { name: 'Senha' });
    phoneNumber = InputValidator.checkTypeAndAssign(phoneNumber, { name: 'Número de celular' });
    comission = InputValidator.checkTypeAndAssign(comission, {
      name: 'Comissão',
      varType: DataTypes.NUMBER,
    });
    observation = InputValidator.checkTypeAndAssign(observation, {
      name: 'Observação',
      required: false,
    });
    activeInd = InputValidator.checkTypeAndAssign(activeInd, {
      name: 'Ativo',
      required: false,
      varType: DataTypes.BOOLEAN,
      defaultValue: true,
    });

    await this.userUseCases.createUser({
      contractorId,
      name,
      email,
      password,
      phoneNumber,
      comission,
      observation,
      activeInd,
    });

    return response.status(HttpStatus.NO_CONTENT).send();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    let { contractorId, name, email, password, phoneNumber, comission, observation, activeInd } = request.body;

    let userId = Number(request.params.id);
    userId = InputValidator.checkTypeAndAssign(userId, {
      name: 'Id do usuário',
      varType: DataTypes.NUMBER,
    });
    contractorId = InputValidator.checkTypeAndAssign(contractorId, {
      name: 'Id do contratante',
      varType: DataTypes.NUMBER,
    });
    name = InputValidator.checkTypeAndAssign(name, { name: 'Nome' });
    email = InputValidator.checkTypeAndAssign(email, { name: 'Email' });
    password = InputValidator.checkTypeAndAssign(password, { name: 'Senha' });
    phoneNumber = InputValidator.checkTypeAndAssign(phoneNumber, { name: 'Número de celular' });
    comission = InputValidator.checkTypeAndAssign(comission, {
      name: 'Comissão',
      varType: DataTypes.NUMBER,
    });
    observation = InputValidator.checkTypeAndAssign(observation, {
      name: 'Observação',
      required: false,
    });
    activeInd = InputValidator.checkTypeAndAssign(activeInd, {
      name: 'Ativo',
      required: false,
      varType: DataTypes.BOOLEAN,
    });

    await this.userUseCases.updateUser({
      userId,
      contractorId,
      name,
      email,
      password,
      phoneNumber,
      comission,
      observation,
      activeInd,
    });

    return response.status(HttpStatus.NO_CONTENT).send();
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    let userId = Number(request.params.id);
    userId = InputValidator.checkTypeAndAssign(userId, {
      name: 'Id do usuário',
      varType: DataTypes.NUMBER,
    });

    await this.userUseCases.deleteUser(userId);
    return response.status(HttpStatus.NO_CONTENT).send();
  }
}
