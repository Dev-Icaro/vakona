import IAuthDTO from '../dtos/IAuthDTO';
import ITokenInfo from '../models/ITokenInfo';

/**
 * Interface representing authentication-related use cases.
 */
export default interface IAuthUseCases {
  /**
   * Logs in a user and returns the authentication token information and cookie.
   * @param authDTO - The authentication data.
   * @returns A promise that resolves to the authentication token information.
   */
  login(authDTO: IAuthDTO): Promise<ITokenInfo>;

  /**
   * Refreshes an authentication token and refresh token using a refresh token hash.
   * @param refreshTokenHash - The hash of the refresh token.
   * @returns A promise that resolves to the new authentication token information.
   */
  refresh(refreshTokenHash: string): Promise<ITokenInfo>;

  /**
   * Logs out a user by invalidating the refresh token and removing the cookie.
   * @param refreshTokenHash - The hash of the refresh token to be invalidated.
   * @returns A promise that resolves once the logout process is complete.
   */
  logout(refreshTokenHash: string): Promise<void>;
}
