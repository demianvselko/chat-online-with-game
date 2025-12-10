import { LocaleVO } from '@domain/shared/value-objects/locale.vo';
import { expectDomainError } from '@test/utils/expect-domain-error';

describe('LocaleVO', () => {
  it('should create a LocaleVO with a valid locale', () => {
    const locale = LocaleVO.create('en-US');
    expect(locale.value).toBe('en-US');
  });

  it('should create a LocaleVO with a valid locale and trimmed', () => {
    const locale = LocaleVO.create('  en-US   ');
    expect(locale.value).toBe('en-US');
  });
  it('should throw DomainError when locale is invalid', () => {
    expectDomainError(
      () => LocaleVO.create('invalid-locale'),
      'INVALID_LOCALE',
      { locale: 'invalid-locale' },
    );
  });

  it('should throw DomainError when locale is empty', () => {
    expectDomainError(() => LocaleVO.create('   '), 'INVALID_LOCALE', {
      locale: '',
    });
  });
});
