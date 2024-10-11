export default interface ITokenInfo {
  accessToken: string;
  refreshToken: string;
  user: {
    userId: number;
    email: string;
    name: string;
  };
}
