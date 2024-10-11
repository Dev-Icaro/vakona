import IControlFields from '@common/interfaces/IControlFields';

export default interface IUser extends IControlFields {
  userId: number;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  activeInd: boolean;
  cpf: string;
  cep: string;
}
