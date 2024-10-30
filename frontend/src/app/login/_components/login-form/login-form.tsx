'use client';

import { Button } from '@/common/ui/components/button';
import { Input } from '@/common/ui/components/input';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { loginAction } from '@/app/_actions/authActions';
import { loginSchema } from '@/app/_schemas/authSchemas';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/common/ui/components/form';

const LoginForm = () => {
  const { handleSubmit, authError, isPending, form } = useLoginForm();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <header>
          <h1 className="text-3xl text-center mb-2">Bem-vindo!</h1>
          <p className="text-center text-[#333333]">Você pode entrar com seu email ou CPF</p>
        </header>

        <div className="flex flex-col space-y-4 my-6">
          {authError && <div className="text-red-600">{authError}</div>}

          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>E-mail ou CPF</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="exemplo@gmail.com" type="email" isError={!!fieldState.error} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Insira sua senha" type="password" isError={!!fieldState.error} />
                </FormControl>
                <FormMessage />
                <Button size="sm" variant="link" className="float-end">
                  Esqueci minha senha
                </Button>
              </FormItem>
            )}
          />
        </div>

        <div className="text-center flex flex-col space-y-2">
          <Button className="w-full" size="lg" type="submit" disabled={isPending}>
            Entrar
          </Button>
          <span>OU</span>
          <Button className="w-full" size="lg" disabled={isPending}>
            Google
          </Button>
        </div>
      </form>
    </Form>
  );
};

type TLoginFormValues = z.infer<typeof loginSchema>;

type TUseLoginFormReturn = {
  handleSubmit: () => void;
  form: UseFormReturn<TLoginFormValues>;
  authError: string;
  isPending: boolean;
};

export const useLoginForm = (): TUseLoginFormReturn => {
  const [authError, setAuthError] = useState('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<TLoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = form.handleSubmit(async data => {
    startTransition(() => {
      loginAction(data).then(data => {
        if (data?.error) setAuthError(data?.error);
      });
    });
  });

  return {
    form,
    handleSubmit,
    authError,
    isPending,
  };
};

export default LoginForm;
