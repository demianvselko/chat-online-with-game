import type { UserProfileProps } from './props/user-profile.props';
import { UrlVO } from '../../shared/value-objects/url.vo';
import { FirstNameVO } from './value-objects/first-name.vo';
import { LastNameVO } from './value-objects/last-name.vo';
import { DisplayNameVO } from './value-objects/display-name.vo';
import { DateOfBirthVO } from './value-objects';

export class UserProfile {
  private readonly props: UserProfileProps;

  private constructor(props: UserProfileProps) {
    this.props = props;
  }

  static create(props: UserProfileProps): UserProfile {
    const normalized: UserProfileProps = {
      ...props,
    };

    if (normalized.firstName !== undefined) {
      const firstNameVO = FirstNameVO.create(normalized.firstName);
      normalized.firstName = firstNameVO.value;
    }

    if (normalized.lastName !== undefined) {
      const lastNameVO = LastNameVO.create(normalized.lastName);
      normalized.lastName = lastNameVO.value;
    }

    if (normalized.displayName !== undefined) {
      const displayNameVO = DisplayNameVO.create(normalized.displayName);
      normalized.displayName = displayNameVO.value;
    }

    if (normalized.profileAvatarUrl) {
      normalized.profileAvatarUrl = UrlVO.create(
        normalized.profileAvatarUrl,
      ).value;
    }

    if (normalized.coverImageUrl) {
      normalized.coverImageUrl = UrlVO.create(normalized.coverImageUrl).value;
    }

    if (normalized.websiteUrl) {
      normalized.websiteUrl = UrlVO.create(normalized.websiteUrl).value;
    }

    if (normalized.dateOfBirth) {
      const dobVO = DateOfBirthVO.create(normalized.dateOfBirth);
      normalized.dateOfBirth = dobVO.value;
    }

    return new UserProfile(normalized);
  }

  get firstName(): string | undefined {
    return this.props.firstName;
  }

  get lastName(): string | undefined {
    return this.props.lastName;
  }

  get displayName(): string | undefined {
    return this.props.displayName;
  }

  get profileAvatarUrl(): string | undefined {
    return this.props.profileAvatarUrl;
  }

  get coverImageUrl(): string | undefined {
    return this.props.coverImageUrl;
  }

  get bio(): string | undefined {
    return this.props.bio;
  }

  get dateOfBirth(): Date | undefined {
    return this.props.dateOfBirth;
  }

  get location(): string | undefined {
    return this.props.location;
  }

  get websiteUrl(): string | undefined {
    return this.props.websiteUrl;
  }

  toProps(): UserProfileProps {
    return { ...this.props };
  }
}
