import { BaseError } from '@domain/shared/errors/base.error';

class TestError extends BaseError {
  constructor(
    code: string,
    message: string,
    context?: Record<string, unknown>,
  ) {
    super(code, message, context);
  }
}

describe('BaseError', () => {
  it('should store code, message and context', () => {
    const error = new TestError('TEST_CODE', 'Test message', { foo: 'bar' });
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(BaseError);
    expect(error).toBeInstanceOf(TestError);
    expect(error.code).toBe('TEST_CODE');
    expect(error.message).toBe('Test message');
    expect(error.context).toEqual({ foo: 'bar' });
  });

  it('should work without context', () => {
    const error = new TestError('NO_CONTEXT', 'No context');
    expect(error.code).toBe('NO_CONTEXT');
    expect(error.message).toBe('No context');
    expect(error.context).toBeUndefined();
  });
});
