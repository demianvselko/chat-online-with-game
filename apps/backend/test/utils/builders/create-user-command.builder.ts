import type { CreateUserCommand } from '@src/application/users/dtos/create-user.command';

export class CreateUserCommandBuilder {
  private readonly data: CreateUserCommand = {
    username: 'john.doe',
    email: 'john.doe@example.com',
    password: 'plain-password',
    locale: 'es-AR',
    timezone: 'America/Argentina/Buenos_Aires',
    firstName: 'John',
    lastName: 'Doe',
    displayName: 'John Doe',
    bio: 'Bio',
    profileAvatarUrl: 'https://example.com/avatar.png',
    coverImageUrl: 'https://example.com/cover.png',
    dateOfBirth: new Date('1990-01-01T00:00:00.000Z'),
    location: 'Buenos Aires',
    websiteUrl: 'https://example.com',
    isProfilePrivate: false,
    canReceiveFriendRequests: true,
    canBeFoundByEmail: true,
    canBeFoundByUsername: true,
    showOnlineStatus: true,
    emailOnFriendRequest: true,
    emailOnMessage: true,
    emailOnTag: true,
  };

  withEmail(email: string): this {
    this.data.email = email;
    return this;
  }

  withUsername(username: string): this {
    this.data.username = username;
    return this;
  }

  withPassword(password: string): this {
    this.data.password = password;
    return this;
  }

  withLocale(locale: string): this {
    this.data.locale = locale;
    return this;
  }

  withTimezone(timezone: string): this {
    this.data.timezone = timezone;
    return this;
  }

  build(): CreateUserCommand {
    return { ...this.data };
  }
}
