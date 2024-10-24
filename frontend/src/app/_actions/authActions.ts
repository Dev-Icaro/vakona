'use server';

import { signIn } from '@/config/auth';

const loginAction = async () => {
  await signIn({});
};
