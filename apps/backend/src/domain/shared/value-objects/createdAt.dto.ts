import { DomainError } from '../errors/domain-errors';

export class CreatedAtVO {
  private constructor(private readonly valueInternal: Date) {}

  static create(value?: Date): CreatedAtVO {
    const now = new Date();
    const date = value ?? now;

    if (date.getTime() > now.getTime()) {
      throw new DomainError('CREATED_AT_IN_FUTURE', {
        createdAt: date.toISOString(),
      });
    }

    return new CreatedAtVO(date);
  }

  get value(): Date {
    return this.valueInternal;
  }
}
