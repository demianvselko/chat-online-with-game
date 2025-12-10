import { EmailVO } from '@domain/shared/value-objects/email.vo';
import { expectDomainError } from '@test/utils/expect-domain-error';

describe('EmailVO', () => {
  const myEmail: string = 'vselkod@gmail.com';
  it('should create an EmailVO with a valid email', () => {
    const email = EmailVO.create(myEmail);
    expect(email.value).toBe(myEmail);
  });

  it('should create an EmailVO with a valid email and trimmed', () => {
    const email = EmailVO.create(myEmail + '   ');
    expect(email.value).toBe(myEmail);
  });

  it('should throw DomainError when email is invalid', () => {
    expectDomainError(() => EmailVO.create('invalid-email'), 'INVALID_EMAIL', {
      email: 'invalid-email',
    });
  });

  it('should throw DomainError when email is empty', () => {
    expectDomainError(() => EmailVO.create('   '), 'INVALID_EMAIL', {
      email: '',
    });
  });
});
