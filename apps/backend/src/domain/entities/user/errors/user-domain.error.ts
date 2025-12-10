import { BaseError } from '@src/domain/shared/errors/base.error';
import {
  UserDomainErrorsConfig,
  type UserDomainErrorCode,
} from './user-domain-error.config';

export class UserDomainError extends BaseError {
  readonly code: UserDomainErrorCode;

  constructor(code: UserDomainErrorCode, context?: Record<string, unknown>) {
    super(code, UserDomainErrorsConfig[code], context);
    this.code = code;
  }
}
