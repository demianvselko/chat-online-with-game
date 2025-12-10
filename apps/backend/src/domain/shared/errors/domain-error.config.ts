export const DomainErrorsConfig = {
  INVALID_UUID: 'Invalid UUID v4 format.',
  CREATED_AT_IN_FUTURE: 'createdAt cannot be in the future.',
  INVALID_EMAIL: 'Invalid email format.',
  INVALID_URL: 'Invalid URL format.',
  INVALID_LOCALE: 'Invalid locale format.',
  INVALID_STRING_EMPTY: 'String cannot be empty.',
  INVALID_STRING_TOO_SHORT: 'String is too short.',
  INVALID_STRING_TOO_LONG: 'String is too long.',
} as const;

export type DomainErrorCode = keyof typeof DomainErrorsConfig;
