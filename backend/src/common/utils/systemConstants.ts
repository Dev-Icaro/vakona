export enum HttpStatus {
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ValidationErrorMessages {
  REQUIRED = 'O campo {0} é obrigatório',
  INVALID_EMAIL = 'O Email informado é inválido',
  MIN_LENGTH = 'O Valor de {0} deve ter no minímo {1} caractéres',
}

const BCRYPT_SALT_ROUNDS = 10;

export { BCRYPT_SALT_ROUNDS };
