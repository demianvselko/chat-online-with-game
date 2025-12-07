import { z } from "zod";
import { UserIdSchema } from "@shared/domain/shared/identifiers";

const EmailSchema = z.string().email().min(5).max(255);
const DisplayNameSchema = z.string().min(1).max(64);

export type Email = z.infer<typeof EmailSchema>;
export type DisplayName = z.infer<typeof DisplayNameSchema>;

export class UserIdVO {
  private constructor(private readonly _value: string) {}

  static create(raw: string): UserIdVO {
    const value = UserIdSchema.parse(raw);
    return new UserIdVO(value);
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }
}

export class EmailVO {
  private constructor(private readonly _value: Email) {}

  static create(raw: string): EmailVO {
    const value = EmailSchema.parse(raw);
    return new EmailVO(value);
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }
}

export class DisplayNameVO {
  private constructor(private readonly _value: DisplayName) {}

  static create(raw: string): DisplayNameVO {
    const value = DisplayNameSchema.parse(raw);
    return new DisplayNameVO(value);
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }
}
