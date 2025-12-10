import { BaseEntity } from '../../shared/base/base.entity';
import type { UserEntityProps } from './props/user.props';
import { UserProfile } from './user-profile.vo';
import { UserDomainError } from './errors/user-domain.error';
import { UserRole } from './enums/user-role.enum';
import { EmailVO, LocaleVO } from '@src/domain/shared/value-objects';

export class UserEntity extends BaseEntity<UserEntityProps> {
  private constructor(props: UserEntityProps, id?: string) {
    const profile = UserProfile.create(props.profile ?? {});
    const finalProps: UserEntityProps = {
      ...props,
      profile: profile.toProps(),
    };

    super(finalProps, id);
  }

  static create(props: UserEntityProps, id?: string): UserEntity {
    const email = EmailVO.create(props.email);
    const locale = LocaleVO.create(props.localeSettings.locale);

    const normalizedProps: UserEntityProps = {
      ...props,
      email: email.value,
      localeSettings: {
        ...props.localeSettings,
        locale: locale.value,
      },
      username: props.username.trim(),
    };

    return new UserEntity(normalizedProps, id);
  }

  get username(): string {
    return this.props.username;
  }

  get email(): string {
    return this.props.email;
  }

  get roles(): UserRole[] {
    return this.props.roles;
  }

  get profile(): UserProfile {
    return UserProfile.create(this.props.profile);
  }

  get stats() {
    return this.props.stats;
  }

  get localeSettings() {
    return this.props.localeSettings;
  }

  addRole(role: UserRole): void {
    this.ensureActive();

    if (!this.props.roles.includes(role)) {
      this.props.roles.push(role);
    }
  }

  removeRole(role: UserRole): void {
    this.ensureActive();

    if (!this.props.roles.includes(role)) {
      return;
    }

    const remainingRoles = this.props.roles.filter((r) => r !== role);

    if (remainingRoles.length === 0) {
      throw new UserDomainError('USER_MUST_HAVE_AT_LEAST_ONE_ROLE', {
        userId: this.id,
      });
    }

    this.props.roles = remainingRoles;
  }

  hasRole(role: UserRole): boolean {
    return this.props.roles.includes(role);
  }

  updateLastLogin(date: Date): void {
    this.ensureActive();
    this.props.lastLoginAt = date;
  }

  markEmailVerified(date: Date): void {
    this.ensureActive();
    this.props.emailVerifiedAt = date;
  }

  updateLastSeen(date: Date): void {
    this.ensureActive();
    this.props.stats.lastSeenAt = date;
  }

  activate(): void {
    if (this.isActive) {
      throw new UserDomainError('USER_ALREADY_ACTIVE', {
        userId: this.id,
      });
    }

    this.props.isActive = true;
  }

  deactivate(): void {
    if (!this.isActive) {
      throw new UserDomainError('USER_ALREADY_INACTIVE', {
        userId: this.id,
      });
    }

    this.props.isActive = false;
  }

  private ensureActive(): void {
    if (!this.isActive) {
      throw new UserDomainError('USER_IS_INACTIVE', {
        userId: this.id,
      });
    }
  }
}
