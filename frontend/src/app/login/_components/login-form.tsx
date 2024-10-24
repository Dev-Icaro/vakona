'use client';

import { Button } from '@/common/ui/components/button';
import { Input } from '@/common/ui/components/input';
import { Label } from '@/common/ui/components/label';
import { FieldErrors, useForm, UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useState } from 'react';
import AuthServiceImpl from '@/infra/services/services-impl/AuthServiceImpl';
import { AxiosHttpClient } from '@/infra/http/HttpClient';
import CoreApiExcpetion from '@/common/exceptions/CoreApiException';

type TLoginFormValues = {
  email: string;
  password: string;
};

type TUseLoginFormReturn = {
  onSubmit: () => void;
  register: UseFormRegister<TLoginFormValues>;
  errors: FieldErrors<TLoginFormValues>;
  apiError: string;
};

const loginFormSchema = z.object({
  email: z.string().min(1, 'Esse campo é obrigatório').email('Email inválido'),
  password: z.string().min(1, 'Esse campo é obrigatório'),
});

export const useLoginForm = (): TUseLoginFormReturn => {
  const [apiError, setApiError] = useState('');
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
    const authService = new AuthServiceImpl(new AxiosHttpClient());

    authService
      .login(data)
      .then(data => console.log(data))
      .catch(error => {
        if (error instanceof CoreApiExcpetion) {
          setApiError(error.message);
        }
      });
  });

  return {
    register,
    onSubmit,
    errors,
    apiError,
  };
};

const LoginForm = () => {
  const { errors, apiError, onSubmit, register } = useLoginForm();

  return (
    <form onSubmit={onSubmit}>
      <header>
        <h1 className="text-3xl text-center mb-2">Bem-vindo!</h1>
        <p className="text-center text-[#333333]">Você pode entrar com seu email ou CPF</p>
      </header>

      <div className="flex flex-col space-y-4 my-8">
        {apiError && <div className="text-red-600">{apiError}</div>}

        <div>
          <Label htmlFor="login">E-mail ou CPF</Label>
          <Input {...register('email')} id="login" placeholder="Insira seu email ou CPF" />
          {errors?.email?.message && <div className="text-red-600">{errors?.email?.message}</div>}
        </div>

        <div>
          <Label htmlFor="password">Senha</Label>
          <Input {...register('password')} id="password" placeholder="Insira sua senha" type="password" />
          {errors?.password?.message && <div className="text-red-600">{errors?.password?.message}</div>}
          <Button size="sm" variant="link" className="float-end">
            Esqueci minha senha
          </Button>
        </div>
      </div>

      <div className="text-center flex flex-col space-y-2">
        <Button className="w-full" size="lg" type="submit">
          Entrar
        </Button>
        <span>OU</span>
        <Button className="w-full" size="lg">
          Google
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
