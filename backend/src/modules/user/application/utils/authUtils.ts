import jwt, { JwtPayload } from 'jsonwebtoken';
import { createHmac } from 'crypto';
import { HttpStatus } from '@common/utils/systemConstants';
import { Request, Response, NextFunction } from 'express';
import { AuthErrorMessages } from '@modules/user/domain/error-messages/AuthErrorMessages';
import settings from '@config/settings.json';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '@config/secrets';
import IUserTokenInfo from '@modules/user/domain/dtos/IUserTokenInfo';

interface AccessTokenPayload extends JwtPayload, IUserTokenInfo {}

/**
 * Creates an access token for the given user.
 *
 * @remarks
 * The access token is a JWT token signed using the HS512 algorithm.
 *
 * @param user - Information about the user.
 * @returns - The generated access token.
 */
export const createAccessToken = (user: IUserTokenInfo) => {
  return jwt.sign({ name: user.name, email: user.email, userId: user.userId }, ACCESS_TOKEN_SECRET!, {
    audience: 'urn:jwt:type:access',
    issuer: 'urn:system:token-issuer:type:access',
    expiresIn: `${settings.ACCESS_TOKEN_DURATION_MINUTES}m`,
  });
};

/**
 * Creates a refresh token for the given email.
 *
 * @remarks
 * The refresh token is a JWT token signed using the HS512 algorithm.
 *
 * @param email - The user's email.
 * @returns - The generated refresh token.
 */
export const createRefreshToken = (email: string) => {
  return jwt.sign({ email }, REFRESH_TOKEN_SECRET!, {
    audience: 'urn:jwt:type:refresh',
    issuer: 'urn:system:token-issuer:type:refresh',
    expiresIn: `${settings.REFRESH_TOKEN_DURATION_MINUTES}m`,
  });
};

/**
 * Creates a hash for the given refresh token.
 *
 * @remarks
 * The hash is created using the SHA512 algorithm.
 *
 * @param token - The refresh token.
 * @returns - The hash of the refresh token.
 */
export const createHashForRefreshToken = (token: string) => {
  return createHmac('sha512', REFRESH_TOKEN_SECRET!).update(token).digest('hex');
};

/**
 * Middleware to check the validity of the refresh token.
 *
 * @remarks
 * The refresh token is expected to be in a cookie according with the env variable REFRESH_TOKEN_COOKIE_NAME.
 * The hash of the refresh token is stored in the `res.locals.refreshTokenHash` object.
 */
export const withRefreshAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies[settings.REFRESH_TOKEN_COOKIE_NAME];
  if (!token) {
    return res.status(HttpStatus.UNAUTHORIZED).send(AuthErrorMessages.UNAUTHORIZED);
  }
  try {
    jwt.verify(token, REFRESH_TOKEN_SECRET!, {
      audience: 'urn:jwt:type:refresh',
    });
    res.locals.refreshTokenHash = createHashForRefreshToken(token);
    next();
  } catch {
    return res.status(HttpStatus.UNAUTHORIZED).send(AuthErrorMessages.INVALID_CREDENTIALS);
  }
};

/**
 * Middleware to check the validity of the access token.
 *
 * @remarks
 * The access token is expected to be in the `Authorization` header in the format `Bearer <token>`.
 * The user information is stored in the `res.locals.user` object.
 */
export const withAccessAuth = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.APP_AUTH_ENABLED === 'false') {
    return next();
  }

  const token = req.headers['authorization']?.split('Bearer ')[1];
  if (!token) {
    return res.status(HttpStatus.UNAUTHORIZED).send(AuthErrorMessages.UNAUTHORIZED);
  }
  try {
    const { name, email, userId } = jwt.verify(token, ACCESS_TOKEN_SECRET!, {
      audience: 'urn:jwt:type:access',
    }) as AccessTokenPayload;

    res.locals.user = { name, email, userId };
    next();
  } catch {
    return res.status(HttpStatus.UNAUTHORIZED).send(AuthErrorMessages.UNAUTHORIZED);
  }
};
