import { DomainError } from '../errors/domain-errors';

export class EmailVO {
  private constructor(private readonly valueInternal: string) {}
  static create(value: string): EmailVO {
    const trimmed = value.trim().toLowerCase();
    if (trimmed.length === 0) {
      throw new DomainError('INVALID_EMAIL', { email: trimmed });
    }
    if (trimmed.includes(' ')) {
      throw new DomainError('INVALID_EMAIL', { email: trimmed });
    }
    const atIndex = trimmed.indexOf('@');
    if (
      atIndex <= 0 ||
      atIndex !== trimmed.lastIndexOf('@') ||
      atIndex === trimmed.length - 1
    ) {
      throw new DomainError('INVALID_EMAIL', { email: trimmed });
    }
    const localPart = trimmed.slice(0, atIndex);
    const domainPart = trimmed.slice(atIndex + 1);
    if (!localPart || !domainPart) {
      throw new DomainError('INVALID_EMAIL', { email: trimmed });
    }
    if (
      !domainPart.includes('.') ||
      domainPart.startsWith('.') ||
      domainPart.endsWith('.')
    ) {
      throw new DomainError('INVALID_EMAIL', { email: trimmed });
    }
    return new EmailVO(trimmed);
  }

  get value(): string {
    return this.valueInternal;
  }
}
