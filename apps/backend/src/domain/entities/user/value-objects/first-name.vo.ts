import { StringVO } from '@domain/shared/value-objects/string.vo';
import { DomainError } from '@domain/shared/errors/domain-errors';
import { UserDomainError } from '../errors/user-domain.error';

export class FirstNameVO {
  private constructor(private readonly valueInternal: string) {}
  static create(value: string): FirstNameVO {
    try {
      const vo = StringVO.create(value, { min: 1, max: 50 });
      return new FirstNameVO(vo.value);
    } catch (error) {
      if (error instanceof DomainError) {
        switch (error.code) {
          case 'INVALID_STRING_EMPTY':
            throw new UserDomainError('FIRST_NAME_EMPTY');
          case 'INVALID_STRING_TOO_SHORT':
            throw new UserDomainError('FIRST_NAME_TOO_SHORT', error.context);
          case 'INVALID_STRING_TOO_LONG':
            throw new UserDomainError('FIRST_NAME_TOO_LONG', error.context);
        }
      }
      throw error;
    }
  }

  get value(): string {
    return this.valueInternal;
  }
}
