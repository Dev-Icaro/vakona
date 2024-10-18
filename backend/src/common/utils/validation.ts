import { RequestHandler } from 'express';
import { ValidationError, ObjectSchema } from 'yup';

type TProperty = 'body' | 'header' | 'params' | 'query';

type TGetSchema = <T>(schema: ObjectSchema<T>) => ObjectSchema<T>;

type TAllSchemas = Record<TProperty, ObjectSchema<any>>;

type TGetAllSchemas = (getSchema: TGetSchema) => Partial<TAllSchemas>;

type TValidation = (schemas: Partial<TAllSchemas>) => RequestHandler;

export const validation: TValidation = getAllSchemas => async (req, res, next) => {
  const schemas = getAllSchemas(schema => schema);

  const errors: Record<string, Record<string, string>> = {};

  Object.entries(schemas).forEach(([key, schema]) => {
    try {
      schema.validateSync(req[key as TProperty], {});
    } catch (error) {
      const yupError = error as ValidationError;
      const errors: Record<string, string> = {};
    }
  });
};
