export const DomainErrorsConfig = {
  INVALID_UUID: 'Invalid UUID v4 format.',
  CREATED_AT_IN_FUTURE: 'createdAt cannot be in the future.',
} as const;

export type DomainErrorCode = keyof typeof DomainErrorsConfig;
