import { DomainError } from '../errors/domain-errors';

export class UpdatedAtVO {
  private constructor(private readonly valueInternal: Date) {}

  static create(value?: Date): UpdatedAtVO {
    const now = new Date();
    const date = value ?? now;

    if (date.getTime() > now.getTime()) {
      throw new DomainError('CREATED_AT_IN_FUTURE', {
        updatedAt: date.toISOString(),
      });
    }

    return new UpdatedAtVO(date);
  }

  get value(): Date {
    return this.valueInternal;
  }
}
