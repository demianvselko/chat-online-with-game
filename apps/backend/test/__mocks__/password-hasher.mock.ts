import type { PasswordHasherPort } from '@domain/ports/security/password-hasher.port';

export type PasswordHasherMock = jest.Mocked<PasswordHasherPort>;

export function makePasswordHasherMock(): PasswordHasherMock {
  return {
    hash: jest.fn(),
    compare: jest.fn(),
  };
}
