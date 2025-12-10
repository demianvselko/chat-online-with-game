import { StringVO } from '@domain/shared/value-objects/string.vo';
import { DomainError } from '@domain/shared/errors/domain-errors';
import { UserDomainError } from '../errors/user-domain.error';

export class LastNameVO {
  private constructor(private readonly valueInternal: string) {}
  static create(value: string): LastNameVO {
    try {
      const vo = StringVO.create(value, { min: 1, max: 80 });
      return new LastNameVO(vo.value);
    } catch (error) {
      if (error instanceof DomainError) {
        switch (error.code) {
          case 'INVALID_STRING_EMPTY':
            throw new UserDomainError('LAST_NAME_EMPTY');
          case 'INVALID_STRING_TOO_SHORT':
            throw new UserDomainError('LAST_NAME_TOO_SHORT', error.context);
          case 'INVALID_STRING_TOO_LONG':
            throw new UserDomainError('LAST_NAME_TOO_LONG', error.context);
        }
      }
      throw error;
    }
  }

  get value(): string {
    return this.valueInternal;
  }
}
