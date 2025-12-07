import { SessionIdSchema, UserIdSchema, GameIdSchema } from '../shared/identifiers';

export class SessionIdVO {
    private constructor(private readonly _value: string) { }

    static create(raw: string): SessionIdVO {
        const value = SessionIdSchema.parse(raw);
        return new SessionIdVO(value);
    }

    get value(): string {
        return this._value;
    }

    toString(): string {
        return this._value;
    }
}

export class UserIdVO {
    private constructor(private readonly _value: string) { }

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

export class GameIdVO {
    private constructor(private readonly _value: string) { }

    static create(raw: string): GameIdVO {
        const value = GameIdSchema.parse(raw);
        return new GameIdVO(value);
    }

    get value(): string {
        return this._value;
    }

    toString(): string {
        return this._value;
    }
}