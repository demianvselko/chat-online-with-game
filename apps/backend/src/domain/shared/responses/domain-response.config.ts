export const DomainResponsesConfig = {
  ENTITY_CREATED: 'Entity created successfully.',
  ENTITY_UPDATED: 'Entity updated successfully.',
} as const;

export type DomainResponseCode = keyof typeof DomainResponsesConfig;
