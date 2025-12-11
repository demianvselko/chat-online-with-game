import { UseCase } from '../../shared/use-case.interface';

import type { UserRepositoryPort } from '@src/domain/ports/user/user-repository.port';
import type { PasswordHasherPort } from '@src/domain/ports/security/password-hasher.port';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { UserRole } from '@src/domain/entities/user/enums/user-role.enum';
import { UserDomainError } from '@src/domain/entities/user/errors/user-domain.error';
import type { UserEntityProps } from '@src/domain/entities/user/props/user.props';
import { CreateUserCommand } from '../dtos/create-user.command';
import { CreateUserResult } from '../dtos/create-user.result';

export class CreateUserUseCase implements UseCase<
  CreateUserCommand,
  CreateUserResult
> {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(command: CreateUserCommand): Promise<CreateUserResult> {
    const normalizedEmail = command.email.trim().toLowerCase();
    const normalizedUsername = command.username.trim();
    const [emailExists, usernameExists] = await Promise.all([
      this.userRepository.existsByEmail(normalizedEmail),
      this.userRepository.existsByUsername(normalizedUsername),
    ]);
    if (emailExists) {
      throw new UserDomainError('USER_EMAIL_ALREADY_IN_USE', {
        email: normalizedEmail,
      });
    }
    if (usernameExists) {
      throw new UserDomainError('USERNAME_ALREADY_IN_USE', {
        username: normalizedUsername,
      });
    }
    const passwordHash = await this.passwordHasher.hash(command.password);
    const now = new Date();
    const props: UserEntityProps = {
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
      roles: [UserRole.USER],
      createdAt: now,
      emailVerifiedAt: undefined,
      lastLoginAt: undefined,
      lastPasswordChangeAt: undefined,
      profile: {
        firstName: command.firstName,
        lastName: command.lastName,
        displayName: command.displayName,
        bio: command.bio,
        profileAvatarUrl: command.profileAvatarUrl,
        coverImageUrl: command.coverImageUrl,
        dateOfBirth: command.dateOfBirth,
        location: command.location,
        websiteUrl: command.websiteUrl,
      },
      privacySettings: {
        isProfilePrivate: command.isProfilePrivate ?? false,
        canReceiveFriendRequests: command.canReceiveFriendRequests ?? true,
        canBeFoundByEmail: command.canBeFoundByEmail ?? true,
        canBeFoundByUsername: command.canBeFoundByUsername ?? true,
        showOnlineStatus: command.showOnlineStatus ?? true,
      },
      notificationSettings: {
        emailOnFriendRequest: command.emailOnFriendRequest ?? true,
        emailOnMessage: command.emailOnMessage ?? true,
        emailOnTag: command.emailOnTag ?? true,
      },
      stats: {
        friendsCount: 0,
        postsCount: 0,
        followersCount: 0,
        followingCount: 0,
        lastSeenAt: undefined,
      },
      localeSettings: {
        locale: command.locale,
        timezone: command.timezone,
      },
      isActive: true,
    };
    const user = UserEntity.create(props);
    await this.userRepository.save(user);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
