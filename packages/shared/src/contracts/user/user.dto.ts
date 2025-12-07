import type { UserRole, UserStatus } from '@shared/domain/user/user.enums';

export interface UserDTO {
    id: string;
    email: string;
    displayName: string;
    role: UserRole;
    status: UserStatus;
    avatarUrl?: string | null;
    createdAt: string;
    updatedAt: string;
}