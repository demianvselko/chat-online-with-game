import { UseCase } from '../../shared/use-case.interface';
import type { UserRepositoryPort } from '@src/domain/ports/user/user-repository.port';
import { UserDomainError } from '@src/domain/entities/user/errors/user-domain.error';
import { GetUserByIdQuery } from '../dtos/get-user-by-id.query';
import { GetUserByIdResult } from '../dtos/get-user-by-id.result';

export class GetUserByIdUseCase implements UseCase<
  GetUserByIdQuery,
  GetUserByIdResult
> {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(query: GetUserByIdQuery): Promise<GetUserByIdResult> {
    const includeInactive = query.includeInactive ?? false;
    const user = await this.userRepository.findById(query.id, includeInactive);
    if (!user) {
      throw new UserDomainError('USER_NOT_FOUND', { userId: query.id });
    }
    const profile = user.profile;
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
      roles: user.roles,
      firstName: profile.firstName,
      lastName: profile.lastName,
      displayName: profile.displayName,
      bio: profile.bio,
      profileAvatarUrl: profile.profileAvatarUrl,
      coverImageUrl: profile.coverImageUrl,
      dateOfBirth: profile.dateOfBirth,
      location: profile.location,
      websiteUrl: profile.websiteUrl,
    };
  }
}
