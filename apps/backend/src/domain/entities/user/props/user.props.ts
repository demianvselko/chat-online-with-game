import { BaseEntityProps } from '@src/domain/shared/base/base.entity.props';
import { UserRole } from '../enums/user-role.enum';
import {
  UserLocaleProps,
  UserNotificationSettingsProps,
  UserPrivacySettingsProps,
  UserProfileProps,
  UserStatsProps,
} from '.';

export interface UserEntityProps extends BaseEntityProps {
  username: string;
  email: string;
  passwordHash: string;
  roles: UserRole[];

  emailVerifiedAt?: Date;
  lastLoginAt?: Date;
  lastPasswordChangeAt?: Date;

  profile: UserProfileProps;
  privacySettings: UserPrivacySettingsProps;
  notificationSettings: UserNotificationSettingsProps;
  stats: UserStatsProps;
  localeSettings: UserLocaleProps;
}
