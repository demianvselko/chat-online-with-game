import { DomainResponsesConfig } from '@domain/shared/responses/domain-response.config';
import { DomainResponse } from '@domain/shared/responses/domain.response';

describe('DomainResponsesConfig', () => {
  it('should contain expected response codes and messages', () => {
    expect(DomainResponsesConfig.ENTITY_CREATED).toBe(
      'Entity created successfully.',
    );
    expect(DomainResponsesConfig.ENTITY_UPDATED).toBe(
      'Entity updated successfully.',
    );
  });
});

describe('DomainResponse', () => {
  it('should build response with message from DomainResponsesConfig', () => {
    const response = new DomainResponse('ENTITY_CREATED', { id: '123' });
    expect(response.code).toBe<'ENTITY_CREATED'>('ENTITY_CREATED');
    expect(response.message).toBe(DomainResponsesConfig.ENTITY_CREATED);
    expect(response.data).toEqual({ id: '123' });
  });

  it('should allow undefined data', () => {
    const response = new DomainResponse('ENTITY_UPDATED');
    expect(response.code).toBe<'ENTITY_UPDATED'>('ENTITY_UPDATED');
    expect(response.message).toBe(DomainResponsesConfig.ENTITY_UPDATED);
    expect(response.data).toBeUndefined();
  });

  it('static ok should create a DomainResponse instance', () => {
    const payload = { id: 'abc' };
    const response = DomainResponse.ok('ENTITY_CREATED', payload);
    expect(response).toBeInstanceOf(DomainResponse);
    expect(response.code).toBe('ENTITY_CREATED');
    expect(response.message).toBe(DomainResponsesConfig.ENTITY_CREATED);
    expect(response.data).toEqual(payload);
  });
});
