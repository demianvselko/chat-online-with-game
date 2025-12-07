import { z } from 'zod';
import { SessionIdVO, UserIdVO, GameIdVO } from './session.vo';
import { SessionRole, SessionStatus } from './session.enums';
import { SessionRoleSchema, SessionStatusSchema } from './session.types';


const SessionParticipantPropsSchema = z.object({
    userId: z.custom<UserIdVO>((v): v is UserIdVO => v instanceof UserIdVO),
    role: SessionRoleSchema,
    teamId: z.string().nullable().optional(),
    joinedAt: z.date(),
    leftAt: z.date().nullable().optional()
});

export type SessionParticipantProps = z.infer<typeof SessionParticipantPropsSchema>;

const SessionPropsSchema = z.object({
    id: z.custom<SessionIdVO>((v): v is SessionIdVO => v instanceof SessionIdVO),
    hostId: z.custom<UserIdVO>((v): v is UserIdVO => v instanceof UserIdVO),
    gameId: z.custom<GameIdVO>((v): v is GameIdVO => v instanceof GameIdVO),
    status: SessionStatusSchema,
    participants: z.array(SessionParticipantPropsSchema),
    createdAt: z.date(),
    startedAt: z.date().nullable().optional(),
    finishedAt: z.date().nullable().optional()
});

export type SessionProps = z.infer<typeof SessionPropsSchema>;

export class SessionParticipant {
    private props: SessionParticipantProps;

    private constructor(props: SessionParticipantProps) {
        this.props = SessionParticipantPropsSchema.parse(props);
    }

    static create(props: SessionParticipantProps): SessionParticipant {
        return new SessionParticipant(props);
    }

    get userId(): UserIdVO {
        return this.props.userId;
    }

    get role(): SessionRole {
        return this.props.role;
    }

    get teamId(): string | null | undefined {
        return this.props.teamId;
    }

    get joinedAt(): Date {
        return this.props.joinedAt;
    }

    get leftAt(): Date | null | undefined {
        return this.props.leftAt;
    }

    leave(at: Date): void {
        this.props.leftAt = at;
    }

    toProps(): SessionParticipantProps {
        return { ...this.props };
    }
}

export class Session {
    private props: SessionProps;

    private constructor(props: SessionProps) {
        this.props = SessionPropsSchema.parse({
            ...props,
            participants: [...props.participants]
        });
    }

    static createNew(params: {
        id: SessionIdVO;
        hostId: UserIdVO;
        gameId: GameIdVO;
        createdAt?: Date;
    }): Session {
        const participantHost: SessionParticipantProps = {
            userId: params.hostId,
            role: SessionRole.HOST,
            teamId: null,
            joinedAt: params.createdAt ?? new Date(),
            leftAt: null
        };

        return new Session({
            id: params.id,
            hostId: params.hostId,
            gameId: params.gameId,
            status: SessionStatus.PENDING,
            participants: [participantHost],
            createdAt: params.createdAt ?? new Date(),
            startedAt: null,
            finishedAt: null
        });
    }

    static restoreFromPersistence(props: SessionProps): Session {
        return new Session(props);
    }

    get id(): SessionIdVO {
        return this.props.id;
    }

    get hostId(): UserIdVO {
        return this.props.hostId;
    }

    get gameId(): GameIdVO {
        return this.props.gameId;
    }

    get status(): SessionStatus {
        return this.props.status;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get startedAt(): Date | null | undefined {
        return this.props.startedAt;
    }

    get finishedAt(): Date | null | undefined {
        return this.props.finishedAt;
    }

    get participants(): SessionParticipant[] {
        return this.props.participants.map((p) => SessionParticipant.create(p));
    }

    start(now: Date = new Date()): void {
        if (this.props.status !== SessionStatus.PENDING) {
            throw new Error('Only PENDING sessions can be started');
        }
        this.props.status = SessionStatus.ACTIVE;
        this.props.startedAt = now;
    }

    finish(now: Date = new Date()): void {
        if (this.props.status === SessionStatus.FINISHED || this.props.status === SessionStatus.CANCELLED) {
            return;
        }
        this.props.status = SessionStatus.FINISHED;
        this.props.finishedAt = now;
    }

    cancel(now: Date = new Date()): void {
        if (this.props.status === SessionStatus.FINISHED || this.props.status === SessionStatus.CANCELLED) {
            return;
        }
        this.props.status = SessionStatus.CANCELLED;
        this.props.finishedAt = now;
    }

    addParticipant(userId: UserIdVO, role: SessionRole, options?: { teamId?: string | null; joinedAt?: Date }): void {
        const exists = this.props.participants.some((p) => p.userId.value === userId.value && !p.leftAt);
        if (exists) {
            throw new Error('User already in session');
        }

        const participant: SessionParticipantProps = {
            userId,
            role,
            teamId: options?.teamId ?? null,
            joinedAt: options?.joinedAt ?? new Date(),
            leftAt: null
        };

        this.props.participants.push(participant);
    }

    removeParticipant(userId: UserIdVO, at: Date = new Date()): void {
        const participant = this.props.participants.find((p) => p.userId.value === userId.value && !p.leftAt);
        if (!participant) {
            return;
        }
        participant.leftAt = at;
    }

    toProps(): SessionProps {
        return {
            ...this.props,
            participants: this.props.participants.map((p) => ({ ...p }))
        };
    }
}