import { DomainError } from '../errors/domain-errors';

export interface StringVOConfig {
  min?: number;
  max?: number;
}

export class StringVO {
  private constructor(private readonly valueInternal: string) {}

  static create(value: string, config: StringVOConfig = {}): StringVO {
    const min = config.min ?? 1;
    const max = config.max ?? 150;

    if (value === undefined || value === null) {
      throw new DomainError('INVALID_STRING_EMPTY');
    }

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new DomainError('INVALID_STRING_EMPTY');
    }

    if (trimmed.length < min) {
      throw new DomainError('INVALID_STRING_TOO_SHORT', { min });
    }

    if (trimmed.length > max) {
      throw new DomainError('INVALID_STRING_TOO_LONG', { max });
    }

    return new StringVO(trimmed);
  }

  get value(): string {
    return this.valueInternal;
  }
}
