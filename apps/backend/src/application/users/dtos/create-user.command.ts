export interface CreateUserCommand {
  username: string;
  email: string;
  password: string;
  locale: string;
  timezone: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  profileAvatarUrl?: string;
  coverImageUrl?: string;
  dateOfBirth?: Date;
  location?: string;
  websiteUrl?: string;
  isProfilePrivate?: boolean;
  canReceiveFriendRequests?: boolean;
  canBeFoundByEmail?: boolean;
  canBeFoundByUsername?: boolean;
  showOnlineStatus?: boolean;
  emailOnFriendRequest?: boolean;
  emailOnMessage?: boolean;
  emailOnTag?: boolean;
}
