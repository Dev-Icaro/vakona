export default interface ICreateUserDTO {
  name: string;
  email: string;
  cpf: string;
  cep: string;
  password: string;
  phoneNumber: string;
  activeInd: boolean;
}
