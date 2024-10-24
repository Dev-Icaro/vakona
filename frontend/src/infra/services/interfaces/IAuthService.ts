export interface IAuthDTO {
  email: string;
  password: string;
}

export interface ITokenInfo {
  accessToken: string;
  user: {
    userId: number;
    email: string;
    name: string;
  };
}

export default interface IAuthService {
  login(authDTO: IAuthDTO): Promise<ITokenInfo>;
}
