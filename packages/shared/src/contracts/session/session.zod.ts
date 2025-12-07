import { z } from "zod";
import {
  SessionRoleSchema,
  SessionStatusSchema,
} from "@shared/domain/session/session.types";
import {
  UserIdSchema,
  SessionIdSchema,
  GameIdSchema,
} from "@shared/domain/shared/identifiers";

export const SessionParticipantDtoSchema = z.object({
  userId: UserIdSchema,
  role: SessionRoleSchema,
  teamId: z.string().nullable().optional(),
  joinedAt: z.string().datetime(),
  leftAt: z.string().datetime().nullable().optional(),
});

export const SessionDtoSchema = z.object({
  id: SessionIdSchema,
  hostId: UserIdSchema,
  gameId: GameIdSchema,
  status: SessionStatusSchema,
  participants: z.array(SessionParticipantDtoSchema),
  createdAt: z.string().datetime(),
  startedAt: z.string().datetime().nullable().optional(),
  finishedAt: z.string().datetime().nullable().optional(),
});

export const CreateSessionRequestDtoSchema = z.object({
  hostId: UserIdSchema,
  gameId: GameIdSchema,
});

export type SessionParticipantDTO = z.infer<typeof SessionParticipantDtoSchema>;
export type SessionDTO = z.infer<typeof SessionDtoSchema>;
export type CreateSessionRequestDTO = z.infer<
  typeof CreateSessionRequestDtoSchema
>;
