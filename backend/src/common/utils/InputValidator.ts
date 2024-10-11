import AppException from '@common/exceptions/AppException';
import Helpers from './Helpers';
import { MaritalStatus } from './systemConstants';

export enum DataTypes {
  STRING = 'string',
  NUMBER = 'number',
  OBJECT = 'object',
  BOOLEAN = 'boolean',
}

/**
 * Interface representing a validation request for the `checkTypeAndAssign` method.
 */
interface IValidationRequest {
  name: string;
  varType?: DataTypes;
  required?: boolean;
  emptyAllowed?: boolean;
  defaultValue?: any;
}

/**
 * Utility class for input validation.
 */
export default class InputValidator {
  /**
   * Private constructor to prevent instantiation of the InputValidator class.
   * @throws - {@link Error}
   * Throws an error with a message indicating that the InputValidator class cannot be instantiated.
   */
  private constructor() {
    throw new Error('InputValidator class cannot be instantiated.');
  }

  /**
   * Checks the type of the provided value and assigns a default value if needed.
   *
   * @param something - The value to be validated.
   * @param options - Validation options including name, type, and defaults.
   * @returns The validated value.
   * @throws - {@link InputValidator} - Throws an exception if the value does not meet the validation criteria.
   */
  public static checkTypeAndAssign(
    something: any,
    {
      name,
      varType = DataTypes.STRING,
      required = true,
      emptyAllowed = false,
      defaultValue = null,
    }: IValidationRequest,
  ): any {
    let isEmpty = false;
    if (required && !something) {
      throw new AppException(`${name} é obrigatório!`);
    }

    if (something && typeof something !== varType) {
      throw new AppException(`${name} inválido, precisa ser do tipo ${varType}!`);
    }

    if (varType !== DataTypes.NUMBER && varType !== DataTypes.BOOLEAN) {
      if (something && (something === '' || Object.keys(something).length === 0)) {
        isEmpty = true;
      }

      if (defaultValue && (!something || isEmpty) && !emptyAllowed) {
        return defaultValue;
      }

      if (isEmpty && !emptyAllowed) {
        throw new AppException(`O valor de ${name} não pode ser vazio!`);
      }
    }

    if (varType === DataTypes.BOOLEAN) {
      if (typeof something === 'undefined') {
        isEmpty = true;
      }

      if (isEmpty && defaultValue !== null) {
        return defaultValue;
      }
    }

    return something;
  }

  /**
   * Validates an email address using a regular expression.
   *
   * @param email - The email address to be validated.
   * @throws - {@link AppException} - Throws an exception if the email address is invalid.
   */
  public static validateEmail(email: string) {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!regex.test(email)) {
      throw new AppException('Email inválido');
    }
  }

  /**
   * Validates a phone number using a regular expression.
   *
   * @param phoneNumber - The phone number to be validated.
   * @throws - {@link AppException} - Throws an exception if the phone number is invalid.
   */
  public static validatePhoneNumber(phoneNumber: string) {
    // eslint-disable-next-line no-useless-escape
    const regex = /^[1-9]{2,3}\(?[1-9]{2}\)? ?(?:[2-8]|9[0-9])[0-9]{3}\-?[0-9]{4}$/;
    if (!regex.test(phoneNumber)) {
      throw new AppException('Número de celular/telefone inválido');
    }
  }

  /**
   * Validates a Brazilian CPF or CNPJ document.
   *
   * @param document - The document (CPF or CNPJ) to be validated.
   * @throws - {@link AppException} - Throws an exception if the document is invalid.
   */
  public static validateCPFAndCNPJ(document: string): void {
    if (!document) {
      throw new AppException('O documento de identificação (CPF/CNPJ) é obrigatório');
    } else if (document.length == 11 && document.replace(/[^0-9]/g, '').length == 11) {
      const cpf = document
        .trim()
        .split('')
        .map(char => Number(char));

      let v1 = 0;
      let v2 = 0;
      let aux = false;

      for (let i = 1; cpf.length > i; i++) {
        if (cpf[i - 1] != cpf[i]) {
          aux = true;
        }
      }

      if (aux == false) {
        throw new AppException('O CPF fornecido é inválido');
      }

      for (let i = 0, p = 10; cpf.length - 2 > i; i++, p--) {
        v1 += cpf[i] * p;
      }

      v1 = (v1 * 10) % 11;

      if (v1 == 10) {
        v1 = 0;
      }

      if (v1 != cpf[9]) {
        throw new AppException('O CPF fornecido é inválido');
      }

      for (let i = 0, p = 11; cpf.length - 1 > i; i++, p--) {
        v2 += cpf[i] * p;
      }

      v2 = (v2 * 10) % 11;

      if (v2 == 10) {
        v2 = 0;
      }

      if (v2 != cpf[10]) {
        throw new AppException('O CPF fornecido é inválido');
      }
    } else if (document.length == 14 && document.replace(/[^0-9]/g, '').length == 14) {
      const cnpj = document
        .trim()
        .split('')
        .map(char => Number(char));

      let v1 = 0;
      let v2 = 0;
      let aux = false;

      for (let i = 1; cnpj.length > i; i++) {
        if (cnpj[i - 1] != cnpj[i]) {
          aux = true;
        }
      }

      if (aux == false) {
        throw new AppException('O CNPJ fornecido é inválido');
      }

      for (let i = 0, p1 = 5, p2 = 13; cnpj.length - 2 > i; i++, p1--, p2--) {
        if (p1 >= 2) {
          v1 += cnpj[i] * p1;
        } else {
          v1 += cnpj[i] * p2;
        }
      }

      v1 = v1 % 11;

      if (v1 < 2) {
        v1 = 0;
      } else {
        v1 = 11 - v1;
      }

      if (v1 != cnpj[12]) {
        throw new AppException('O CNPJ fornecido é inválido');
      }

      for (let i = 0, p1 = 6, p2 = 14; cnpj.length - 1 > i; i++, p1--, p2--) {
        if (p1 >= 2) {
          v2 += cnpj[i] * p1;
        } else {
          v2 += cnpj[i] * p2;
        }
      }

      v2 = v2 % 11;

      if (v2 < 2) {
        v2 = 0;
      } else {
        v2 = 11 - v2;
      }

      if (v2 != cnpj[13]) {
        throw new AppException('O CNPJ fornecido é inválido');
      }
    } else {
      throw new AppException('O documento de identificação (CPF/CNPJ) fornecido é inválido');
    }
  }

  /**
   * Validates a marital status.
   *
   * @param maritalStatus - The marital status to be validated.
   * @throws - {@link AppException} - Throws an exception if the marital status is invalid.
   */
  public static validateMaritalStatus(maritalStatus: string): void {
    if (!maritalStatus) {
      throw new AppException('O estado civil é obrigatório');
    }

    if (!Helpers.stringMatchesEnumValue(maritalStatus, MaritalStatus)) {
      throw new AppException('O estado civil fornecido é inválido');
    }
  }
}
