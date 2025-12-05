export abstract class BaseError extends Error {
  readonly code: string;
  readonly context?: Record<string, unknown>;

  protected constructor(
    code: string,
    message: string,
    context?: Record<string, unknown>,
  ) {
    super(message);
    this.code = code;
    this.context = context;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
