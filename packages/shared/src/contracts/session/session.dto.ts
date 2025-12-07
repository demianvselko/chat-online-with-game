import type { SessionStatus, SessionRole } from '@shared/domain/session/session.enums';

export interface SessionParticipantDTO {
    userId: string;
    role: SessionRole;
    teamId?: string | null;
    joinedAt: string;
    leftAt?: string | null;
}

export interface SessionDTO {
    id: string;
    hostId: string;
    gameId: string;
    status: SessionStatus;
    participants: SessionParticipantDTO[];
    createdAt: string;
    startedAt?: string | null;
    finishedAt?: string | null;
}

export interface CreateSessionRequestDTO {
    hostId: string;
    gameId: string;
}