import { DomainError } from '../errors/domain-errors';

export class UrlVO {
  private constructor(private readonly valueInternal: string) {}
  static create(value: string): UrlVO {
    const valueTrimmed = value.trim();
    let urlObject: URL;

    try {
      urlObject = new URL(valueTrimmed);
    } catch {
      throw new DomainError('INVALID_URL', { url: valueTrimmed });
    }
    return new UrlVO(urlObject.href);
  }

  get value(): string {
    return this.valueInternal;
  }
}
