import { UserProfile } from '@domain/entities/user/user-profile.vo';
import type { UserProfileProps } from '@domain/entities/user/props/user-profile.props';
import { DomainError } from '@domain/shared/errors/domain-errors';
import { expectUserDomainError } from '@test/utils/expect-user-domain-error';
import { makeUserProfileProps } from '@test/utils/builders/user-profile.builder';

describe('UserProfile', () => {
  it('should create a profile with normalized values and keep props via getters', () => {
    const props = makeUserProfileProps();
    const profile = UserProfile.create(props);
    expect(profile.firstName).toBe(props.firstName);
    expect(profile.lastName).toBe(props.lastName);
    expect(profile.displayName).toBe(props.displayName);
    expect(profile.bio).toBe(props.bio);
    expect(profile.profileAvatarUrl).toBe(props.profileAvatarUrl);
    expect(profile.coverImageUrl).toBe(props.coverImageUrl);
    expect(profile.dateOfBirth?.toISOString()).toBe(
      props.dateOfBirth?.toISOString(),
    );
    expect(profile.location).toBe(props.location);
    expect(profile.websiteUrl).toBe(props.websiteUrl);
    const resultProps = profile.toProps();
    expect(resultProps).toEqual(props);
  });

  it('should allow creating an empty profile (all optional)', () => {
    const emptyProps: UserProfileProps = {};
    const profile = UserProfile.create(emptyProps);
    expect(profile.firstName).toBeUndefined();
    expect(profile.lastName).toBeUndefined();
    expect(profile.displayName).toBeUndefined();
    expect(profile.bio).toBeUndefined();
    expect(profile.profileAvatarUrl).toBeUndefined();
    expect(profile.coverImageUrl).toBeUndefined();
    expect(profile.dateOfBirth).toBeUndefined();
    expect(profile.location).toBeUndefined();
    expect(profile.websiteUrl).toBeUndefined();
    expect(profile.toProps()).toEqual({});
  });

  it('should normalize firstName, lastName and displayName via VOs (trim)', () => {
    const props = makeUserProfileProps({
      firstName: '   John   ',
      lastName: '  Doe  ',
      displayName: '   Johnny Doe   ',
    });
    const profile = UserProfile.create(props);
    expect(profile.firstName).toBe('John');
    expect(profile.lastName).toBe('Doe');
    expect(profile.displayName).toBe('Johnny Doe');
  });

  it('should validate URLs using UrlVO and throw DomainError on invalid avatar url', () => {
    const props = makeUserProfileProps({
      profileAvatarUrl: 'not-a-valid-url',
    });
    expect(() => UserProfile.create(props)).toThrow(DomainError);
  });

  it('should validate dateOfBirth using DateOfBirthVO and propagate UserDomainError when in the future', () => {
    const futureDob = new Date(Date.now() + 60_000);
    const props = makeUserProfileProps({
      dateOfBirth: futureDob,
    });
    expectUserDomainError(
      () => UserProfile.create(props),
      'DATE_OF_BIRTH_IN_FUTURE',
      {
        dateOfBirth: futureDob.toISOString(),
      },
    );
  });
});
