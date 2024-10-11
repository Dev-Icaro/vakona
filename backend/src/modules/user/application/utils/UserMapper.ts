import IUserDTO from '@modules/user/domain/dtos/IUserDTO';
import IUser from '@modules/user/domain/models/IUser';

/**
 * Mapper class responsable for converting user models related objects.
 */
export default class UserMapper {
  /**
   * Converts a user model to a user DTO.
   *
   * @param user - The user model to be converted.
   * @returns The converted user DTO.
   * */
  static modelToDTO(user: IUser): IUserDTO {
    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      activeInd: user.activeInd,
      cpf: user.cpf,
      cep: user.cep,
    };
  }

  /**
   * Converts a user row to a user model.
   *
   * @param userRow - The user row to be converted.
   * @returns The converted user model.
   */
  static rowToModel(userRow: any): IUser {
    return {
      userId: userRow.user_id,
      name: userRow.name,
      email: userRow.email,
      password: userRow.password,
      phoneNumber: userRow.phone_number,
      activeInd: userRow.active_ind,
      cpf: userRow.cpf,
      cep: userRow.cep,
      creationDate: userRow.creation_date,
      updateDate: userRow.update_date,
    };
  }
}
