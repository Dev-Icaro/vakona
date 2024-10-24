import { DefaultSession } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    meta: {
      email: string;
      id: string;
      name: string;
      role: string;
    };
    user: {
      id: string;
      role: string;
      accessToken: string;
    } & DefaultSession;
    // jwt: {};
  }

  // interface User extends DefaultUser {}
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    name: string;
  }
}
