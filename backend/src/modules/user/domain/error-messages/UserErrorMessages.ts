export enum UserErrorMessages {
  USER_NOT_FOUND = 'Usuário com Id: {0} não foi encontrado.',
  USERS_NOT_FOUND = 'Nenhum usuário encontrado.',
  USER_WITH_EMAIL_ALREADY_EXISTS = 'Já existe um usuário com o email: {0}.',
  USER_WITH_PHONE_ALREADY_EXISTS = 'Já existe um usuário com o telefone/celular: {0}.',
  USER_PERMISSION_ALREDY_ADDED = 'O usuário já possui a permissão para a rota com Id: {0}.',
  USER_PERMISSION_NOT_ADDED = 'O usuário não possui a permissão para a rota com Id: {0}.',
  USER_HAS_NO_PERMISSIONS = 'O usuário não possui permissões.',
  INVALID_COMISSION_VALUE = 'O valor da comissão precisa estar entre 0 e 100, o valor recebido foi: {0}',
  USER_INACTIVE = 'Usuário inativo.',
}
