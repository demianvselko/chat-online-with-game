import { DateOfBirthVO } from '@domain/entities/user/value-objects/date-of-birth.vo';
import { expectUserDomainError } from '@test/utils/expect-user-domain-error';

describe('DateOfBirthVO', () => {
  it('should create a DateOfBirthVO with a valid past date', () => {
    const date = new Date('2000-01-01T00:00:00.000Z');
    const vo = DateOfBirthVO.create(date);
    expect(vo.value).toBeInstanceOf(Date);
    expect(vo.value.toISOString()).toBe(date.toISOString());
  });

  it('should throw DATE_OF_BIRTH_INVALID when value is not a valid date instance', () => {
    expectUserDomainError(
      //@ts-expect-error - intentionally passing invalid type to test validation
      () => DateOfBirthVO.create('not-a-date'),
      'DATE_OF_BIRTH_INVALID',
    );
  });

  it('should throw DATE_OF_BIRTH_INVALID when value is an invalid Date', () => {
    const invalidDate = new Date('invalid-date');
    expectUserDomainError(
      () => DateOfBirthVO.create(invalidDate),
      'DATE_OF_BIRTH_INVALID',
    );
  });

  it('should throw DATE_OF_BIRTH_IN_FUTURE when date is in the future', () => {
    const futureDate = new Date(Date.now() + 60_000);
    expectUserDomainError(
      () => DateOfBirthVO.create(futureDate),
      'DATE_OF_BIRTH_IN_FUTURE',
      { dateOfBirth: futureDate.toISOString() },
    );
  });
});
