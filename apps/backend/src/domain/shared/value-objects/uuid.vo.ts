import { randomUUID } from 'node:crypto';
import { DomainError } from '../errors/domain-errors';

export class UuidVO {
  private constructor(private readonly valueInternal: string) {}

  static create(value?: string): UuidVO {
    const id = value ?? randomUUID();

    const uuidV4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidV4Regex.test(id)) {
      throw new DomainError('INVALID_UUID', { id });
    }

    return new UuidVO(id);
  }

  get value(): string {
    return this.valueInternal;
  }
}
