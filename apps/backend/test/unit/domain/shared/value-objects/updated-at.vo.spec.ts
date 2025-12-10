import { UpdatedAtVO } from '@domain/shared/value-objects/updated-at.vo';
import { expectDomainError } from '@test/utils/expect-domain-error';

describe('UpdatedAtVO', () => {
  it('should create an UpdatedAtVO with a valid provided date', () => {
    const date = new Date('2021-01-01T00:00:00.000Z');
    const vo = UpdatedAtVO.create(date);
    expect(vo.value).toEqual(date);
  });

  it('should use current date when no value is provided', () => {
    const before = Date.now();
    const vo = UpdatedAtVO.create();
    const after = Date.now();
    const updatedAt = vo.value.getTime();
    expect(updatedAt).toBeGreaterThanOrEqual(before);
    expect(updatedAt).toBeLessThanOrEqual(after);
  });

  it('should throw DomainError when date is in the future', () => {
    const futureDate = new Date(Date.now() + 60_000);
    expectDomainError(
      () => UpdatedAtVO.create(futureDate),
      'CREATED_AT_IN_FUTURE',
      { updatedAt: futureDate.toISOString() },
    );
  });

  it('should keep the exact same date instance passed in input', () => {
    const date = new Date('2020-12-31T23:59:59.000Z');
    const vo = UpdatedAtVO.create(date);
    expect(vo.value).toBe(date);
  });
});
