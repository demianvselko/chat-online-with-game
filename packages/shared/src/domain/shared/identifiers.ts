import { z } from "zod";

export const UserIdSchema = z.string().uuid();
export type UserId = z.infer<typeof UserIdSchema>;

export const SessionIdSchema = z.string().uuid();
export type SessionId = z.infer<typeof SessionIdSchema>;

export const GameIdSchema = z.string().uuid();
export type GameId = z.infer<typeof GameIdSchema>;
