import { RequestHandler } from 'express';
import { ObjectSchema, ValidationError } from 'yup';
import { HttpStatus } from './systemConstants';

export type TRequestValidationSchema = {
  body?: ObjectSchema<any>;
  params?: ObjectSchema<any>;
  query?: ObjectSchema<any>;
};

export const validation =
  (schemas: TRequestValidationSchema): RequestHandler =>
  async (request, response, next) => {
    const errors: Record<string, string[]> = {};

    Object.entries(schemas).forEach(([key, schema]) => {
      try {
        const requestProp = key as keyof typeof request;
        schema.validateSync(request[requestProp], { abortEarly: false });
      } catch (error) {
        if (error instanceof ValidationError) {
          errors[key] = error.errors;
        }
      }
    });

    const hasError = Object.keys(errors).length > 0;
    if (hasError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        errors,
      });
    }

    next();
  };
