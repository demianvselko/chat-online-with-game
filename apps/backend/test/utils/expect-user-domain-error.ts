import { UserDomainError } from '@domain/entities/user/errors/user-domain.error';

export function expectUserDomainError(
  fn: () => unknown,
  code: string,
  context?: Record<string, unknown>,
): void {
  try {
    fn();
    throw new Error('Expected UserDomainError to be thrown');
  } catch (error) {
    expect(error).toBeInstanceOf(UserDomainError);
    const err = error as UserDomainError;
    expect(err.code).toBe(code);

    if (context) {
      expect(err.context).toBeDefined();
      expect(err.context).toMatchObject(context);
    }
  }
}
