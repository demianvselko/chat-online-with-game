export const UserDomainErrorsConfig = {
  USER_MUST_HAVE_AT_LEAST_ONE_ROLE: 'User must have at least one role.',
  USER_IS_INACTIVE: 'User is inactive.',
  USER_ALREADY_INACTIVE: 'User is already inactive.',
  USER_ALREADY_ACTIVE: 'User is already active.',
  USER_EMAIL_ALREADY_IN_USE: 'Email is already in use.',
  USERNAME_ALREADY_IN_USE: 'Username is already in use.',
  FIRST_NAME_EMPTY: 'First name cannot be empty.',
  FIRST_NAME_TOO_SHORT: 'First name is too short.',
  FIRST_NAME_TOO_LONG: 'First name is too long.',

  LAST_NAME_EMPTY: 'Last name cannot be empty.',
  LAST_NAME_TOO_SHORT: 'Last name is too short.',
  LAST_NAME_TOO_LONG: 'Last name is too long.',

  DISPLAY_NAME_EMPTY: 'Display name cannot be empty.',
  DISPLAY_NAME_TOO_SHORT: 'Display name is too short.',
  DISPLAY_NAME_TOO_LONG: 'Display name is too long.',

  DATE_OF_BIRTH_IN_FUTURE: 'Date of birth cannot be in the future.',
  DATE_OF_BIRTH_INVALID: 'Date of birth is not a valid date.',

  USER_NOT_FOUND: 'User not found.',
} as const;

export type UserDomainErrorCode = keyof typeof UserDomainErrorsConfig;
