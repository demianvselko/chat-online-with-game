import { StringVO } from '@domain/shared/value-objects/string.vo';
import { expectDomainError } from '@test/utils/expect-domain-error';

describe('StringVO', () => {
  it('should create a StringVO with a valid string within length limits', () => {
    const str = StringVO.create('Hello, World!', { min: 5, max: 20 });
    expect(str.value).toBe('Hello, World!');
  });
  it('should trim the string when creating StringVO', () => {
    const str = StringVO.create('   Hello, World!   ', { min: 5, max: 20 });
    expect(str.value).toBe('Hello, World!');
  });

  it('should throw DomainError when string is empty', () => {
    expectDomainError(
      () => StringVO.create('   ', { min: 1, max: 10 }),
      'INVALID_STRING_EMPTY',
    );
  });

  it('should throw DomainError when string is too short', () => {
    expectDomainError(
      () => StringVO.create('Hi', { min: 5, max: 10 }),
      'INVALID_STRING_TOO_SHORT',
      { min: 5 },
    );
  });
  it('should throw DomainError when string is too long', () => {
    expectDomainError(
      () =>
        StringVO.create('This string is definitely too long', {
          min: 1,
          max: 10,
        }),
      'INVALID_STRING_TOO_LONG',
      { max: 10 },
    );
  });
});
