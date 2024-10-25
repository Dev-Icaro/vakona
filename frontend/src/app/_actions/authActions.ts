'use server';

import { signIn, signOut } from '@/config/auth';
import { IAuthDTO } from '@/infra/services/interfaces/IAuthService';
import { AppRoutes, DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';

export const loginAction = async (values: IAuthDTO) => {
  const { email, password } = values;

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Credenciais inválidas!' };
        default:
          return { error: 'Ops, Algo deu errado.' };
      }
    }

    throw error;
  }
};

export const logoutAction = async () => {
  await signOut({
    redirectTo: AppRoutes.DASHBOARD,
  });
};
