/* eslint-disable @typescript-eslint/unbound-method */

import {
  makePasswordHasherMock,
  type PasswordHasherMock,
} from '@mocks/password-hasher.mock';
import {
  makeUserRepositoryMock,
  type UserRepositoryMock,
} from '@mocks/user-repository.mock';
import { CreateUserUseCase } from '@src/application/users/use-cases/create-user.use-case';
import { UserRole } from '@src/domain/entities/user/enums/user-role.enum';
import { DomainError } from '@src/domain/shared/errors/domain-errors';
import type { PasswordHash } from '@src/domain/ports/security/password-hasher.port';
import { CreateUserCommandBuilder } from '@test/utils/builders/create-user-command.builder';

describe('CreateUserUseCase', () => {
  let userRepository: UserRepositoryMock;
  let passwordHasher: PasswordHasherMock;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    userRepository = makeUserRepositoryMock();
    passwordHasher = makePasswordHasherMock();
    useCase = new CreateUserUseCase(userRepository, passwordHasher);
  });

  it('should create a user and persist it when email and username are unique', async () => {
    userRepository.existsByEmail.mockResolvedValue(false);
    userRepository.existsByUsername.mockResolvedValue(false);
    passwordHasher.hash.mockResolvedValue('hashed-password' as PasswordHash);
    const command = new CreateUserCommandBuilder()
      .withEmail('   John.Doe@Example.COM   ')
      .withUsername('   john.doe   ')
      .withPassword('my-secret')
      .build();

    const before = Date.now();
    const result = await useCase.execute(command);
    const after = Date.now();

    expect(userRepository.existsByEmail).toHaveBeenCalledWith(
      'john.doe@example.com',
    );
    expect(userRepository.existsByUsername).toHaveBeenCalledWith('john.doe');
    expect(passwordHasher.hash).toHaveBeenCalledWith('my-secret');
    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(result.id).toBeDefined();
    expect(result.username).toBe('john.doe');
    expect(result.email).toBe('john.doe@example.com');
    expect(result.isActive).toBe(true);
    const createdAtTime = result.createdAt.getTime();
    expect(createdAtTime).toBeGreaterThanOrEqual(before);
    expect(createdAtTime).toBeLessThanOrEqual(after);
  });

  it('should throw USER_EMAIL_ALREADY_IN_USE when email already exists', async () => {
    userRepository.existsByEmail.mockResolvedValue(true);
    userRepository.existsByUsername.mockResolvedValue(false);
    passwordHasher.hash.mockResolvedValue('hashed-password' as PasswordHash);
    const command = new CreateUserCommandBuilder()
      .withEmail('   used@example.com   ')
      .withUsername('john.doe')
      .build();

    await expect(useCase.execute(command)).rejects.toEqual(
      expect.objectContaining({
        code: 'USER_EMAIL_ALREADY_IN_USE',
      }),
    );

    expect(userRepository.existsByEmail).toHaveBeenCalledWith(
      'used@example.com',
    );
    expect(userRepository.existsByUsername).toHaveBeenCalledWith('john.doe');
    expect(userRepository.save).not.toHaveBeenCalled();
    expect(passwordHasher.hash).not.toHaveBeenCalled();
  });

  it('should throw USERNAME_ALREADY_IN_USE when username already exists', async () => {
    userRepository.existsByEmail.mockResolvedValue(false);
    userRepository.existsByUsername.mockResolvedValue(true);
    passwordHasher.hash.mockResolvedValue('hashed-password' as PasswordHash);
    const command = new CreateUserCommandBuilder()
      .withEmail('new@example.com')
      .withUsername('   taken.username   ')
      .build();

    await expect(useCase.execute(command)).rejects.toEqual(
      expect.objectContaining({
        code: 'USERNAME_ALREADY_IN_USE',
      }),
    );
    expect(userRepository.existsByEmail).toHaveBeenCalledWith(
      'new@example.com',
    );
    expect(userRepository.existsByUsername).toHaveBeenCalledWith(
      'taken.username',
    );
    expect(userRepository.save).not.toHaveBeenCalled();
    expect(passwordHasher.hash).not.toHaveBeenCalled();
  });

  it('should initialize defaults and not require optional profile/settings fields', async () => {
    userRepository.existsByEmail.mockResolvedValue(false);
    userRepository.existsByUsername.mockResolvedValue(false);
    passwordHasher.hash.mockResolvedValue('hashed-password' as PasswordHash);
    const command = {
      username: 'minimal.user',
      email: 'minimal@example.com',
      password: 'pwd',
      locale: 'es-AR',
      timezone: 'America/Argentina/Buenos_Aires',
    };
    const result = await useCase.execute(command);
    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(result.username).toBe('minimal.user');
    expect(result.email).toBe('minimal@example.com');
    expect(result.isActive).toBe(true);
  });

  it('should propagate errors from password hasher and not persist user', async () => {
    userRepository.existsByEmail.mockResolvedValue(false);
    userRepository.existsByUsername.mockResolvedValue(false);
    passwordHasher.hash.mockRejectedValue(new Error('hash-failed'));
    const command = new CreateUserCommandBuilder()
      .withEmail('john.doe@example.com')
      .withUsername('john.doe')
      .withPassword('my-secret')
      .build();

    await expect(useCase.execute(command)).rejects.toThrow('hash-failed');
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should propagate domain errors thrown when creating the user entity (e.g. invalid email)', async () => {
    userRepository.existsByEmail.mockResolvedValue(false);
    userRepository.existsByUsername.mockResolvedValue(false);
    passwordHasher.hash.mockResolvedValue('hashed-password' as PasswordHash);
    const command = new CreateUserCommandBuilder()
      .withEmail('invalid-email')
      .withUsername('john.doe')
      .build();

    await expect(useCase.execute(command)).rejects.toBeInstanceOf(DomainError);
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should assign default USER role to the created user (via repository save call)', async () => {
    userRepository.existsByEmail.mockResolvedValue(false);
    userRepository.existsByUsername.mockResolvedValue(false);
    passwordHasher.hash.mockResolvedValue('hashed-password' as PasswordHash);
    const command = new CreateUserCommandBuilder().build();
    await useCase.execute(command);
    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        roles: [UserRole.USER],
      }),
    );
  });
});
