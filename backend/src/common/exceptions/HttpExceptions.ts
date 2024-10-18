import { HttpStatus } from '@common/utils/systemConstants';
import AppException from './AppException';

export class ConflictException extends AppException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}

export class BadRequestException extends AppException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class NotFoundException extends AppException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}
