import type { UserProfileProps } from '@domain/entities/user/props/user-profile.props';

export function makeUserProfileProps(
  override: Partial<UserProfileProps> = {},
): UserProfileProps {
  return {
    firstName: 'John',
    lastName: 'Doe',
    displayName: 'John Doe',
    bio: 'Hello, I am John Doe.',
    profileAvatarUrl: 'https://example.com/avatar.png',
    coverImageUrl: 'https://example.com/cover.png',
    dateOfBirth: new Date('2000-01-01T00:00:00.000Z'),
    location: 'Buenos Aires, Argentina',
    websiteUrl: 'https://example.com/',
    ...override,
  };
}
