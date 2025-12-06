import { DomainError } from '@domain/shared/errors/domain-errors';
import {
  DomainErrorsConfig,
  type DomainErrorCode,
} from '@domain/shared/errors/domain-error.config';

describe('DomainErrorsConfig', () => {
  it('should contain expected error codes and messages', () => {
    expect(DomainErrorsConfig.INVALID_UUID).toBe('Invalid UUID v4 format.');
    expect(DomainErrorsConfig.CREATED_AT_IN_FUTURE).toBe(
      'createdAt cannot be in the future.',
    );
  });
});

describe('DomainError', () => {
  it('should build error with message from DomainErrorsConfig', () => {
    const error = new DomainError('INVALID_UUID', { id: 'x' });
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DomainError);
    expect(error.code).toBe<'INVALID_UUID'>('INVALID_UUID');
    expect(error.message).toBe(DomainErrorsConfig.INVALID_UUID);
    expect(error.context).toEqual({ id: 'x' });
  });

  it('should accept any valid DomainErrorCode', () => {
    const code: DomainErrorCode = 'CREATED_AT_IN_FUTURE';
    const error = new DomainError(code, { createdAt: 'future' });
    expect(error.code).toBe('CREATED_AT_IN_FUTURE');
    expect(error.message).toBe(DomainErrorsConfig.CREATED_AT_IN_FUTURE);
    expect(error.context).toEqual({ createdAt: 'future' });
  });
});
