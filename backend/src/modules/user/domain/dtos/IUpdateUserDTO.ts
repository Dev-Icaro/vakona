export default interface IUpdateUserDTO {
  userId: number;
  name: string;
  email: string;
  cpf: string;
  cep: string;
  password?: string;
  phoneNumber: string;
  activeInd: boolean;
}
