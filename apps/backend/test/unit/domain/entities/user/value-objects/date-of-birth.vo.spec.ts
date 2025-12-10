import { DisplayNameVO } from '@domain/entities/user/value-objects/display-name.vo';
import { expectUserDomainError } from '@test/utils/expect-user-domain-error';

describe('DisplayNameVO', () => {
  it('should create a valid display name and trim value', () => {
    const vo = DisplayNameVO.create('   Johnny   ');
    expect(vo.value).toBe('Johnny');
  });

  it('should throw DISPLAY_NAME_EMPTY when value is empty or whitespace', () => {
    expectUserDomainError(
      () => DisplayNameVO.create('   '),
      'DISPLAY_NAME_EMPTY',
    );
  });

  it('should throw DISPLAY_NAME_TOO_SHORT when value is shorter than 3 characters', () => {
    expectUserDomainError(
      () => DisplayNameVO.create('Hi'),
      'DISPLAY_NAME_TOO_SHORT',
      { min: 3 },
    );
  });

  it('should throw DISPLAY_NAME_TOO_LONG when value exceeds 50 characters', () => {
    const longDisplayName = 'a'.repeat(51);
    expectUserDomainError(
      () => DisplayNameVO.create(longDisplayName),
      'DISPLAY_NAME_TOO_LONG',
      { max: 50 },
    );
  });
});
