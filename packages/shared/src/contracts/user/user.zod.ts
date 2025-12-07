import { z } from "zod";
import { UserIdSchema } from "@shared/domain/shared/identifiers";
import { UserRole, UserStatus } from "@shared/domain/user/user.enums";

export const UserRoleSchema = z.nativeEnum(UserRole);
export const UserStatusSchema = z.nativeEnum(UserStatus);

export const UserDtoSchema = z.object({
  id: UserIdSchema,
  email: z.string().email().min(5).max(255),
  displayName: z.string().min(1).max(64),
  role: UserRoleSchema,
  status: UserStatusSchema,
  avatarUrl: z.string().url().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type UserDTO = z.infer<typeof UserDtoSchema>;
