import {
  DomainResponsesConfig,
  type DomainResponseCode,
} from './domain-response.config';

export class DomainResponse<T = unknown> {
  readonly code: DomainResponseCode;
  readonly message: string;
  readonly data?: T;

  constructor(code: DomainResponseCode, data?: T) {
    this.code = code;
    this.message = DomainResponsesConfig[code];
    this.data = data;
  }

  static ok<T>(code: DomainResponseCode, data?: T): DomainResponse<T> {
    return new DomainResponse<T>(code, data);
  }
}
