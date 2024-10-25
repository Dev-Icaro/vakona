import { AxiosHttpClient } from '@/infra/http/HttpClient';
import AuthServiceImpl from '@/infra/services/services-impl/AuthServiceImpl';
import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'email' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const authService = new AuthServiceImpl(new AxiosHttpClient());

        const tokenInfo = await authService
          .login({
            email: email,
            password: password,
          })
          .catch(error => {
            throw new CredentialsSignin(error.message);
          });

        if (tokenInfo) {
          return {
            ...tokenInfo.user,
            accessToken: tokenInfo.accessToken,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.userId = user.userId;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.userId = token.userId;

      return session;
    },
  },
});
