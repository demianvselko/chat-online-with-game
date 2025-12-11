import { FirstNameVO } from '@domain/entities/user/value-objects/first-name.vo';
import { expectUserDomainError } from '@test/utils/expect-user-domain-error';

describe('FirstNameVO', () => {
  it('should create a valid first name and trim value', () => {
    const vo = FirstNameVO.create('   John   ');
    expect(vo.value).toBe('John');
  });

  it('should throw FIRST_NAME_EMPTY when value is empty or whitespace', () => {
    expectUserDomainError(() => FirstNameVO.create('   '), 'FIRST_NAME_EMPTY');
  });

  it('should throw FIRST_NAME_TOO_LONG when value exceeds 50 characters', () => {
    const longFirstName = 'a'.repeat(51);

    expectUserDomainError(
      () => FirstNameVO.create(longFirstName),
      'FIRST_NAME_TOO_LONG',
      { max: 50 },
    );
  });
});
