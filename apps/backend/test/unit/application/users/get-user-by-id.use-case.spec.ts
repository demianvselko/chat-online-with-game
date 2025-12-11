/* eslint-disable @typescript-eslint/unbound-method */

import { GetUserByIdUseCase } from '@src/application/users/use-cases/get-user-by-id.use-case';
import { UserRole } from '@src/domain/entities/user/enums/user-role.enum';
import {
  makeUserRepositoryMock,
  type UserRepositoryMock,
} from '@mocks/user-repository.mock';
import {
  buildActiveUser,
  buildInactiveUser,
  makeUserEntityProps,
} from '@test/utils/builders/user.builder';
import { makeUserProfileProps } from '@test/utils/builders/user-profile.builder';

describe('GetUserByIdUseCase', () => {
  let userRepository: UserRepositoryMock;
  let useCase: GetUserByIdUseCase;

  beforeEach(() => {
    userRepository = makeUserRepositoryMock();
    useCase = new GetUserByIdUseCase(userRepository);
  });

  it('should return user data when active user exists (includeInactive default false)', async () => {
    const user = buildActiveUser(
      makeUserEntityProps({
        username: 'john.doe',
        email: 'john.doe@example.com',
        profile: makeUserProfileProps({
          firstName: 'John',
          lastName: 'Doe',
          displayName: 'John Doe',
          bio: 'Hello, I am John Doe.',
          profileAvatarUrl: 'https://example.com/avatar.png',
          coverImageUrl: 'https://example.com/cover.png',
          location: 'Buenos Aires, Argentina',
          websiteUrl: 'https://example.com/',
        }),
      }),
    );
    userRepository.findById.mockResolvedValue(user);
    const result = await useCase.execute({ id: user.id });
    expect(userRepository.findById).toHaveBeenCalledWith(user.id, false);
    expect(result.id).toBe(user.id);
    expect(result.username).toBe('john.doe');
    expect(result.email).toBe('john.doe@example.com');
    expect(result.isActive).toBe(true);
    expect(result.createdAt).toEqual(user.createdAt);
    expect(result.roles).toEqual<[UserRole.USER]>([UserRole.USER]);
    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('Doe');
    expect(result.displayName).toBe('John Doe');
    expect(result.bio).toBe('Hello, I am John Doe.');
    expect(result.profileAvatarUrl).toBe('https://example.com/avatar.png');
    expect(result.coverImageUrl).toBe('https://example.com/cover.png');
    expect(result.location).toBe('Buenos Aires, Argentina');
    expect(result.websiteUrl).toBe('https://example.com/');
    expect(result.dateOfBirth).toEqual(user.profile.dateOfBirth);
  });

  it('should pass includeInactive=true to repository and return inactive user', async () => {
    const user = buildInactiveUser({
      username: 'inactive.user',
      email: 'inactive@example.com',
    });
    userRepository.findById.mockResolvedValue(user);
    const result = await useCase.execute({
      id: user.id,
      includeInactive: true,
    });
    expect(userRepository.findById).toHaveBeenCalledWith(user.id, true);
    expect(result.id).toBe(user.id);
    expect(result.isActive).toBe(false);
    expect(result.username).toBe('inactive.user');
    expect(result.email).toBe('inactive@example.com');
  });

  it('should map optional profile fields to undefined when they are not set', async () => {
    const user = buildActiveUser(
      makeUserEntityProps({
        profile: makeUserProfileProps({
          firstName: undefined,
          lastName: undefined,
          displayName: undefined,
          bio: undefined,
          profileAvatarUrl: undefined,
          coverImageUrl: undefined,
          dateOfBirth: undefined,
          location: undefined,
          websiteUrl: undefined,
        }),
      }),
    );
    userRepository.findById.mockResolvedValue(user);
    const result = await useCase.execute({ id: user.id });
    expect(result.firstName).toBeUndefined();
    expect(result.lastName).toBeUndefined();
    expect(result.displayName).toBeUndefined();
    expect(result.bio).toBeUndefined();
    expect(result.profileAvatarUrl).toBeUndefined();
    expect(result.coverImageUrl).toBeUndefined();
    expect(result.dateOfBirth).toBeUndefined();
    expect(result.location).toBeUndefined();
    expect(result.websiteUrl).toBeUndefined();
  });

  it('should throw USER_NOT_FOUND when repository returns null', async () => {
    const missingId = 'a8098c1a-f86e-4e44-9c29-6c7cd1f4013f';
    userRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute({ id: missingId })).rejects.toEqual(
      expect.objectContaining({
        code: 'USER_NOT_FOUND',
      }),
    );
  });

  it('should propagate unexpected errors thrown by repository', async () => {
    const userId = 'a8098c1a-f86e-4e44-9c29-6c7cd1f4013f';
    userRepository.findById.mockRejectedValue(new Error('db-failure'));
    await expect(useCase.execute({ id: userId })).rejects.toThrow('db-failure');
  });
});
