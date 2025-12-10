import { DomainError } from '../errors/domain-errors';

export class EmailVO {
  private constructor(private readonly valueInternal: string) {}
  static create(value: string): EmailVO {
    const valueTrimmed = value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(valueTrimmed)) {
      throw new DomainError('INVALID_EMAIL', { email: valueTrimmed });
    }
    return new EmailVO(valueTrimmed.toLowerCase());
  }

  get value(): string {
    return this.valueInternal;
  }
}
