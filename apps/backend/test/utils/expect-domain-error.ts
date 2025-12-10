import { DomainError } from '@domain/shared/errors/domain-errors';
import type { DomainErrorCode } from '@domain/shared/errors/domain-error.config';

export function expectDomainError(
  fn: () => unknown,
  code: DomainErrorCode,
  context?: Record<string, unknown>,
): void {
  try {
    fn();
    throw new Error('Expected DomainError to be thrown');
  } catch (error) {
    expect(error).toBeInstanceOf(DomainError);
    const err = error as DomainError;
    expect(err.code).toBe(code);

    if (context) {
      expect(err.context).toBeDefined();
      expect(err.context).toMatchObject(context);
    }
  }
}
