import { DomainError } from '../errors/domain-errors';

export class LocaleVO {
  private constructor(private readonly valueInternal: string) {}
  static create(value: string): LocaleVO {
    const valueTrimmed = value.trim();
    const localeRegex = /^[a-z]{2,3}-[A-Z]{2}$/;
    if (!localeRegex.test(valueTrimmed)) {
      throw new DomainError('INVALID_LOCALE', { locale: valueTrimmed });
    }
    return new LocaleVO(valueTrimmed);
  }

  get value(): string {
    return this.valueInternal;
  }
}
