import { UserEntity } from '@domain/entities/user/user.entity';
import type { UserEntityProps } from '@domain/entities/user/props/user.props';
import { UserRole } from '@domain/entities/user/enums/user-role.enum';
import { DomainError } from '@domain/shared/errors/domain-errors';
import { expectUserDomainError } from '@test/utils/expect-user-domain-error';
import {
  makeUserEntityProps,
  buildActiveUser,
  buildInactiveUser,
} from '@test/utils/builders/user.builder';

describe('UserEntity', () => {
  it('should create a user with normalized username (trim)', () => {
    const props: UserEntityProps = makeUserEntityProps({
      username: '   john_doe   ',
    });
    const user = UserEntity.create(props);
    expect(user.username).toBe('john_doe');
  });

  it('should normalize email and localeSettings via EmailVO and LocaleVO', () => {
    const props: UserEntityProps = makeUserEntityProps({
      email: 'john.doe@example.com',
      localeSettings: {
        locale: 'es-AR',
        timezone: 'America/Argentina/Buenos_Aires',
      },
    });
    const user = UserEntity.create(props);
    expect(user.email).toBe('john.doe@example.com');
    expect(user.localeSettings.locale).toBe('es-AR');
    expect(user.localeSettings.timezone).toBe('America/Argentina/Buenos_Aires');
  });

  it('should expose profile as UserProfile and keep its props', () => {
    const props: UserEntityProps = makeUserEntityProps();
    const user = UserEntity.create(props);
    const profile = user.profile;
    expect(profile.toProps()).toEqual(props.profile);
  });

  it('should throw DomainError when email is invalid', () => {
    const props: UserEntityProps = makeUserEntityProps({
      email: 'not-an-email',
    });
    expect(() => UserEntity.create(props)).toThrow(DomainError);
  });

  it('should add a new role when user is active and role not present', () => {
    const user = buildActiveUser({
      roles: [UserRole.USER],
    });
    user.addRole(UserRole.ADMIN);
    expect(user.roles).toContain(UserRole.USER);
    expect(user.roles).toContain(UserRole.ADMIN);
    expect(user.roles.length).toBe(2);
  });

  it('should not add duplicate roles', () => {
    const user = buildActiveUser({
      roles: [UserRole.USER],
    });
    user.addRole(UserRole.USER);
    expect(user.roles).toEqual([UserRole.USER]);
  });

  it('should remove an existing role when user is active and more than one role remains', () => {
    const user = buildActiveUser({
      roles: [UserRole.USER, UserRole.ADMIN],
    });
    user.removeRole(UserRole.ADMIN);
    expect(user.roles).toEqual([UserRole.USER]);
  });

  it('should do nothing when removing a non-existing role', () => {
    const user = buildActiveUser({
      roles: [UserRole.USER],
    });
    user.removeRole(UserRole.ADMIN);
    expect(user.roles).toEqual([UserRole.USER]);
  });

  it('should throw USER_MUST_HAVE_AT_LEAST_ONE_ROLE when removing the last role', () => {
    const user = buildActiveUser({
      roles: [UserRole.USER],
    });
    expectUserDomainError(
      () => user.removeRole(UserRole.USER),
      'USER_MUST_HAVE_AT_LEAST_ONE_ROLE',
      { userId: user.id },
    );
  });

  it('should correctly report if user has a given role', () => {
    const user = buildActiveUser({
      roles: [UserRole.USER, UserRole.ADMIN],
    });
    expect(user.hasRole(UserRole.USER)).toBe(true);
    expect(user.hasRole(UserRole.ADMIN)).toBe(true);
    expect(user.hasRole(UserRole.MODERATOR)).toBe(false);
  });

  it('should throw USER_IS_INACTIVE when adding a role if user is inactive', () => {
    const user = buildInactiveUser({
      roles: [UserRole.USER],
    });
    expectUserDomainError(
      () => user.addRole(UserRole.ADMIN),
      'USER_IS_INACTIVE',
      { userId: user.id },
    );
  });

  it('should throw USER_IS_INACTIVE when removing a role if user is inactive', () => {
    const user = buildInactiveUser({
      roles: [UserRole.USER],
    });
    expectUserDomainError(
      () => user.removeRole(UserRole.USER),
      'USER_IS_INACTIVE',
      { userId: user.id },
    );
  });

  it('should throw USER_IS_INACTIVE when updating last login if user is inactive', () => {
    const user = buildInactiveUser();
    const date = new Date('2024-01-01T00:00:00.000Z');
    expectUserDomainError(
      () => user.updateLastLogin(date),
      'USER_IS_INACTIVE',
      { userId: user.id },
    );
  });

  it('should throw USER_IS_INACTIVE when marking email verified if user is inactive', () => {
    const user = buildInactiveUser();
    const date = new Date('2024-01-01T00:00:00.000Z');
    expectUserDomainError(
      () => user.markEmailVerified(date),
      'USER_IS_INACTIVE',
      { userId: user.id },
    );
  });

  it('should throw USER_IS_INACTIVE when updating last seen if user is inactive', () => {
    const user = buildInactiveUser();
    const date = new Date('2024-01-01T00:00:00.000Z');
    expectUserDomainError(() => user.updateLastSeen(date), 'USER_IS_INACTIVE', {
      userId: user.id,
    });
  });

  it('should deactivate an active user and prevent double deactivation', () => {
    const user = buildActiveUser();
    expect(user.isActive).toBe(true);
    user.deactivate();
    expect(user.isActive).toBe(false);
    expectUserDomainError(() => user.deactivate(), 'USER_ALREADY_INACTIVE', {
      userId: user.id,
    });
  });

  it('should activate an inactive user and prevent double activation', () => {
    const user = buildInactiveUser();
    expect(user.isActive).toBe(false);
    user.activate();
    expect(user.isActive).toBe(true);
    expectUserDomainError(() => user.activate(), 'USER_ALREADY_ACTIVE', {
      userId: user.id,
    });
  });

  it('should update lastLoginAt when user is active', () => {
    const user = buildActiveUser();
    const date = new Date('2024-02-02T10:00:00.000Z');
    user.updateLastLogin(date);
    const internal = user as unknown as { props: UserEntityProps };
    expect(internal.props.lastLoginAt).toBe(date);
  });

  it('should update emailVerifiedAt when user is active', () => {
    const user = buildActiveUser();
    const date = new Date('2024-02-03T10:00:00.000Z');
    user.markEmailVerified(date);
    const internal = user as unknown as { props: UserEntityProps };
    expect(internal.props.emailVerifiedAt).toBe(date);
  });

  it('should update stats.lastSeenAt when user is active', () => {
    const user = buildActiveUser();
    const date = new Date('2024-02-04T10:00:00.000Z');
    user.updateLastSeen(date);
    expect(user.stats.lastSeenAt).toBe(date);
  });
});
