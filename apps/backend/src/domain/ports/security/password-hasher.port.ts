import type { Brand } from 'utility-types';

export type PasswordHash = Brand<string, 'PasswordHash'>;

export interface PasswordHasherPort {
  hash(plain: string): Promise<PasswordHash>;
  compare(plain: string, hash: PasswordHash): Promise<boolean>;
}
