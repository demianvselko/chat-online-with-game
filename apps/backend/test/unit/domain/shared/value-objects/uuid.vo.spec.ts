import { UuidVO } from '@domain/shared/value-objects/uuid.vo';
import { DomainError } from '@domain/shared/errors/domain-errors';

describe('UuidVO', () => {
  it('should create a valid UUID when passing a correct UUIDv4 string', () => {
    const valid = 'a8098c1a-f86e-4e44-9c29-6c7cd1f4013f';
    const vo = UuidVO.create(valid);
    expect(vo.value).toBe(valid);
  });

  it('should generate a valid UUIDv4 when no value is provided', () => {
    const vo = UuidVO.create();
    expect(vo.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('should throw DomainError when value is not a valid UUIDv4', () => {
    expect(() => UuidVO.create('invalid-uuid')).toThrow(DomainError);
    try {
      UuidVO.create('invalid-uuid');
    } catch (e) {
      const err = e as DomainError;
      expect(err.code).toBe('INVALID_UUID');
      expect(err.context).toBeDefined();
      expect(err.context!.id).toBe('invalid-uuid');
    }
  });

  it('should keep the exact same UUID passed in input', () => {
    const uuid = 'd9428888-122b-4f5a-a123-3ce4c3f1aa12';
    const vo = UuidVO.create(uuid);
    expect(vo.value).toBe(uuid);
  });
});
