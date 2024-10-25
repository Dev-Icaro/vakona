'use client';

import { Button } from '@/common/ui/components/button';
import { Input } from '@/common/ui/components/input';
import { Label } from '@/common/ui/components/label';
import { FieldErrors, useForm, UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useState, useTransition } from 'react';
import { loginAction } from '@/app/_actions/authActions';

const LoginForm = () => {
  const { errors, authError, onSubmit, register, isPending } = useLoginForm();

  return (
    <form onSubmit={onSubmit}>
      <header>
        <h1 className="text-3xl text-center mb-2">Bem-vindo!</h1>
        <p className="text-center text-[#333333]">Você pode entrar com seu email ou CPF</p>
      </header>

      <div className="flex flex-col space-y-4 my-8">
        {authError && <div className="text-red-600">{authError}</div>}

        <div>
          <Label htmlFor="login">E-mail ou CPF</Label>
          <Input {...register('email')} id="login" disabled={isPending} placeholder="Insira seu email ou CPF" />
          {errors?.email?.message && <div className="text-red-600">{errors?.email?.message}</div>}
        </div>

        <div>
          <Label htmlFor="password">Senha</Label>
          <Input
            {...register('password')}
            id="password"
            disabled={isPending}
            placeholder="Insira sua senha"
            type="password"
          />
          {errors?.password?.message && <div className="text-red-600">{errors?.password?.message}</div>}

          <Button size="sm" variant="link" className="float-end">
            Esqueci minha senha
          </Button>
        </div>
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
  );
};

const loginFormSchema = z.object({
  email: z.string().min(1, 'Esse campo é obrigatório').email('Email inválido'),
  password: z.string().min(1, 'Esse campo é obrigatório'),
});

type TLoginFormValues = {
  email: string;
  password: string;
};

type TUseLoginFormReturn = {
  onSubmit: () => void;
  register: UseFormRegister<TLoginFormValues>;
  errors: FieldErrors<TLoginFormValues>;
  authError: string;
  isPending: boolean;
};

export const useLoginForm = (): TUseLoginFormReturn => {
  const [authError, setAuthError] = useState('');
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async data => {
    startTransition(() => {
      loginAction(data).then(data => {
        if (data?.error) setAuthError(data?.error);
      });
    });
  });

  return {
    register,
    onSubmit,
    errors,
    authError,
    isPending,
  };
};

export default LoginForm;
