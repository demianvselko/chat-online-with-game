export interface GetUserByIdResult {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  roles: string[];
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  profileAvatarUrl?: string;
  coverImageUrl?: string;
  dateOfBirth?: Date;
  location?: string;
  websiteUrl?: string;
}
