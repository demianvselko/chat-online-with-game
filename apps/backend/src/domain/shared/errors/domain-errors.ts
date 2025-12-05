import { BaseError } from './base.error';
import {
  DomainErrorsConfig,
  type DomainErrorCode,
} from './domain-error.config';

export class DomainError extends BaseError {
  readonly code: DomainErrorCode;

  constructor(code: DomainErrorCode, context?: Record<string, unknown>) {
    super(code, DomainErrorsConfig[code], context);
    this.code = code;
  }
}
