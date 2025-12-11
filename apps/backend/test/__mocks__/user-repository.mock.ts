import type { UserRepositoryPort } from '@domain/ports/user/user-repository.port';

export type UserRepositoryMock = jest.Mocked<UserRepositoryPort>;

export function makeUserRepositoryMock(): UserRepositoryMock {
  return {
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByUsername: jest.fn(),
    existsByEmail: jest.fn(),
    existsByUsername: jest.fn(),
    findManyByIds: jest.fn(),
    search: jest.fn(),
  };
}
