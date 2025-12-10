import type { UserEntityProps } from '@domain/entities/user/props/user.props';
import { UserRole } from '@domain/entities/user/enums/user-role.enum';
import { UserEntity } from '@domain/entities/user/user.entity';
import { makeUserProfileProps } from './user-profile.builder';

export function makeUserEntityProps(
  override: Partial<UserEntityProps> = {},
): UserEntityProps {
  return {
    createdAt: new Date('2021-01-01T00:00:00.000Z'),
    isActive: true,
    username: 'john_doe',
    email: 'john.doe@example.com',
    passwordHash: 'hashed-password',
    roles: [UserRole.USER],

    emailVerifiedAt: undefined,
    lastLoginAt: undefined,
    lastPasswordChangeAt: undefined,

    profile: makeUserProfileProps(),
    privacySettings: {
      isProfilePrivate: false,
      canReceiveFriendRequests: true,
      canBeFoundByEmail: true,
      canBeFoundByUsername: true,
      showOnlineStatus: true,
    },
    notificationSettings: {
      emailOnFriendRequest: true,
      emailOnMessage: true,
      emailOnTag: true,
    },
    stats: {
      friendsCount: 10,
      postsCount: 5,
      followersCount: 7,
      followingCount: 8,
      lastSeenAt: undefined,
    },
    localeSettings: {
      locale: 'es-AR',
      timezone: 'America/Argentina/Buenos_Aires',
    },
    ...override,
  };
}

export function buildActiveUser(
  override: Partial<UserEntityProps> = {},
): UserEntity {
  return UserEntity.create(makeUserEntityProps(override));
}

export function buildInactiveUser(
  override: Partial<UserEntityProps> = {},
): UserEntity {
  return UserEntity.create(
    makeUserEntityProps({
      isActive: false,
      ...override,
    }),
  );
}
