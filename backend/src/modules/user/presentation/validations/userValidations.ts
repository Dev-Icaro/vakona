import { validation } from '@common/utils/validation';
import ICreateUserDTO from '@modules/user/domain/dtos/ICreateUserDTO';
import yup from '@config/yup';
import IUpdateUserDTO from '@modules/user/domain/dtos/IUpdateUserDTO';

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
});

export const updateUserValidation = validation({
  body: yup.object().shape<Record<keyof Omit<IUpdateUserDTO, 'userId'>, yup.AnySchema>>({
    name: yup.string().required(),
    cpf: yup.string().notRequired().max(11),
    phoneNumber: yup.string().notRequired().min(9),
    email: yup.string().email().required(),
    cep: yup.string().notRequired().min(8),
    activeInd: yup.bool().default(true),
    password: yup.string().required().min(10),
  }),
  params: yup.object().shape({
    id: yup.number().required(),
  }),
});

export const getUserByIdValidation = validation({
  params: yup.object().shape({
    id: yup.number().required(),
  }),
});

export const deleteUserValidation = validation({
  params: yup.object().shape({
    id: yup.number().required(),
  }),
});
