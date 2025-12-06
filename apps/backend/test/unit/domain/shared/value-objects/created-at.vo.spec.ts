import { CreatedAtVO } from '@domain/shared/value-objects/created-at.vo';
import { DomainError } from '@domain/shared/errors/domain-errors';

describe('CreatedAtVO', () => {
  it('should create a CreatedAtVO with a valid provided date', () => {
    const date = new Date('2021-01-01T00:00:00.000Z');
    const vo = CreatedAtVO.create(date);
    expect(vo.value).toEqual(date);
  });

  it('should use current date when no value is provided', () => {
    const before = Date.now();
    const vo = CreatedAtVO.create();
    const after = Date.now();
    const createdAt = vo.value.getTime();
    expect(createdAt).toBeGreaterThanOrEqual(before);
    expect(createdAt).toBeLessThanOrEqual(after);
  });

  it('should throw DomainError when date is in the future', () => {
    const futureDate = new Date(Date.now() + 60_000);
    expect(() => CreatedAtVO.create(futureDate)).toThrow(DomainError);
    try {
      CreatedAtVO.create(futureDate);
    } catch (err) {
      const e = err as DomainError;
      expect(e.code).toBe('CREATED_AT_IN_FUTURE');
      expect(e.context).toBeDefined();
      expect(e.context!.createdAt).toBe(futureDate.toISOString());
    }
  });

  it('should keep the exact same date instance passed in input', () => {
    const date = new Date('2020-12-31T23:59:59.000Z');
    const vo = CreatedAtVO.create(date);
    expect(vo.value).toBe(date);
  });
});
