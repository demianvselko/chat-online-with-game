import type { UserEntity } from '../../entities/user/user.entity';
import type { UserRole } from '../../entities/user/enums/user-role.enum';
import type {
  PaginationParams,
  PaginatedResult,
} from '../../shared/pagination/pagination.types';

export interface UserSearchFilters {
  roles?: UserRole[];
  isActive?: boolean;
  locale?: string;
  text?: string;
  createdFrom?: Date;
  createdTo?: Date;
}

export interface UserRepositoryPort {
  save(user: UserEntity): Promise<void>;

  findById(id: string, includeInactive?: boolean): Promise<UserEntity | null>;
  findByEmail(
    email: string,
    includeInactive?: boolean,
  ): Promise<UserEntity | null>;
  findByUsername(
    username: string,
    includeInactive?: boolean,
  ): Promise<UserEntity | null>;
  findManyByIds(
    ids: string[],
    includeInactive?: boolean,
  ): Promise<UserEntity[]>;

  existsByEmail(email: string): Promise<boolean>;
  existsByUsername(username: string): Promise<boolean>;

  search(
    filters: UserSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<UserEntity>>;
}
