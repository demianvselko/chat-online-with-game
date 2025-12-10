import { LastNameVO } from '@domain/entities/user/value-objects/last-name.vo';
import { expectUserDomainError } from '@test/utils/expect-user-domain-error';

describe('LastNameVO', () => {
  it('should create a valid last name and trim value', () => {
    const vo = LastNameVO.create('   Doe   ');
    expect(vo.value).toBe('Doe');
  });

  it('should throw LAST_NAME_EMPTY when value is empty or whitespace', () => {
    expectUserDomainError(() => LastNameVO.create('   '), 'LAST_NAME_EMPTY');
  });

  it('should throw LAST_NAME_TOO_LONG when value exceeds 80 characters', () => {
    const longLastName = 'a'.repeat(81);

    expectUserDomainError(
      () => LastNameVO.create(longLastName),
      'LAST_NAME_TOO_LONG',
      { max: 80 },
    );
  });
});
