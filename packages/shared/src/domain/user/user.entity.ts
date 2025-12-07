import { z } from "zod";
import { UserRole, UserStatus } from "./user.enums";
import { UserIdVO, EmailVO, DisplayNameVO } from "./user.vo";

const UserPropsSchema = z.object({
  id: z.custom<UserIdVO>((v): v is UserIdVO => v instanceof UserIdVO),
  email: z.custom<EmailVO>((v): v is EmailVO => v instanceof EmailVO),
  displayName: z.custom<DisplayNameVO>(
    (v): v is DisplayNameVO => v instanceof DisplayNameVO,
  ),
  passwordHash: z.string().min(1),
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus),
  avatarUrl: z.string().url().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserProps = z.infer<typeof UserPropsSchema>;

export class User {
  private props: UserProps;

  private constructor(props: UserProps) {
    this.props = UserPropsSchema.parse(props);
  }

  static createNew(params: {
    id: UserIdVO;
    email: EmailVO;
    displayName: DisplayNameVO;
    passwordHash: string;
    role?: UserRole;
    status?: UserStatus;
    avatarUrl?: string | null;
    createdAt?: Date;
  }): User {
    const now = params.createdAt ?? new Date();

    return new User({
      id: params.id,
      email: params.email,
      displayName: params.displayName,
      passwordHash: params.passwordHash,
      role: params.role ?? UserRole.PLAYER,
      status: params.status ?? UserStatus.ACTIVE,
      avatarUrl: params.avatarUrl ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restoreFromPersistence(props: UserProps): User {
    return new User(props);
  }

  get id(): UserIdVO {
    return this.props.id;
  }

  get email(): EmailVO {
    return this.props.email;
  }

  get displayName(): DisplayNameVO {
    return this.props.displayName;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get avatarUrl(): string | null | undefined {
    return this.props.avatarUrl;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  changeDisplayName(displayName: DisplayNameVO): void {
    this.props.displayName = displayName;
    this.touch();
  }

  changeAvatar(url: string | null): void {
    this.props.avatarUrl = url;
    this.touch();
  }

  changeRole(role: UserRole): void {
    this.props.role = role;
    this.touch();
  }

  changeStatus(status: UserStatus): void {
    this.props.status = status;
    this.touch();
  }

  changePasswordHash(passwordHash: string): void {
    this.props.passwordHash = passwordHash;
    this.touch();
  }

  toProps(): UserProps {
    return { ...this.props };
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
