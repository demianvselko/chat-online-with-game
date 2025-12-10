import { StringVO } from '@domain/shared/value-objects/string.vo';
import { DomainError } from '@domain/shared/errors/domain-errors';
import { UserDomainError } from '../errors/user-domain.error';

export class DisplayNameVO {
  private constructor(private readonly valueInternal: string) {}
  static create(value: string): DisplayNameVO {
    try {
      const vo = StringVO.create(value, { min: 3, max: 50 });
      return new DisplayNameVO(vo.value);
    } catch (error) {
      if (error instanceof DomainError) {
        switch (error.code) {
          case 'INVALID_STRING_EMPTY':
            throw new UserDomainError('DISPLAY_NAME_EMPTY');
          case 'INVALID_STRING_TOO_SHORT':
            throw new UserDomainError('DISPLAY_NAME_TOO_SHORT', error.context);
          case 'INVALID_STRING_TOO_LONG':
            throw new UserDomainError('DISPLAY_NAME_TOO_LONG', error.context);
        }
      }
      throw error;
    }
  }

  get value(): string {
    return this.valueInternal;
  }
}
