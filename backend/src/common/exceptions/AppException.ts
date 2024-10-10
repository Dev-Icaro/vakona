import { HttpStatus } from '@common/utils/systemConstants';

/**
 * Represents an application-specific exception with a message and an associated status code.
 */
export default class AppException extends Error {
  /**
   * The descriptive message associated with the exception.
   */
  public readonly message: string;
  /**
   * The HTTP status code associated with the exception.
   * @defaultValue 400
   */
  public readonly statusCode: number;

  /**
   * Creates a new instance of the AppException class.
   *
   * @param message - The descriptive message for the exception.
   * @param statusCode - The HTTP status code for the exception (default is 400).
   */
  constructor(message: string, statusCode = HttpStatus.BAD_REQUEST) {
    super(message);
    this.statusCode = statusCode;
  }
}
