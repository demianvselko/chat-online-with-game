import { z } from "zod";
import { SessionRole, SessionStatus } from "./session.enums";

export const SessionRoleSchema = z.nativeEnum(SessionRole);
export const SessionStatusSchema = z.nativeEnum(SessionStatus);
