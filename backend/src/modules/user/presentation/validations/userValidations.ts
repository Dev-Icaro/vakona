import { validation } from '@common/utils/validation';
import ICreateUserDTO from '@modules/user/domain/dtos/ICreateUserDTO';
import * as yup from 'yup';

export const createUserValidation = validation({
  body: yup.object().shape<Record<keyof ICreateUserDTO, yup.AnySchema>>({
    name: yup.string().required(),
    cpf: yup.string().notRequired().max(11),
    phoneNumber: yup.string().notRequired().min(9),
    email: yup.string().email().required(),
    cep: yup.string().notRequired().min(8),
    activeInd: yup.bool().default(true),
    password: yup.string().required().min(10),
  }),
  query: yup.object().shape({
    perPage: yup.string().required(),
  }),
});
