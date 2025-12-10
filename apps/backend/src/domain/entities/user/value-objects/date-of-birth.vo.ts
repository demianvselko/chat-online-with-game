import { UserDomainError } from '../errors/user-domain.error';

export class DateOfBirthVO {
  private constructor(private readonly valueInternal: Date) {}
  static create(value: Date): DateOfBirthVO {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new UserDomainError('DATE_OF_BIRTH_INVALID');
    }
    const now = new Date();
    if (value.getTime() > now.getTime()) {
      throw new UserDomainError('DATE_OF_BIRTH_IN_FUTURE', {
        dateOfBirth: value.toISOString(),
      });
    }
    return new DateOfBirthVO(value);
  }

  get value(): Date {
    return this.valueInternal;
  }
}
