import { BaseEntity } from '@domain/shared/base/base.entity';
import type { BaseEntityProps } from '@domain/shared/base/base.entity.props';
import { DomainError } from '@domain/shared/errors/domain-errors';

interface TestEntityProps extends BaseEntityProps {
  name: string;
}

class TestEntity extends BaseEntity<TestEntityProps> {
  private constructor(props: TestEntityProps, id?: string) {
    super(props, id);
  }
  static create(props: TestEntityProps, id?: string): TestEntity {
    return new TestEntity(props, id);
  }
  get name(): string {
    return this.props.name;
  }
}

describe('BaseEntity', () => {
  it('should assign id from constructor when provided', () => {
    const props: TestEntityProps = {
      name: 'John',
      createdAt: new Date('2020-01-01T00:00:00.000Z'),
      isActive: true,
    };
    const id = 'a8098c1a-f86e-4e44-9c29-6c7cd1f4013f';
    const entity = TestEntity.create(props, id);
    expect(entity.id).toBe(id);
    expect(entity.name).toBe('John');
  });

  it('should generate a valid UUID when id is not provided', () => {
    const props: TestEntityProps = {
      name: 'Jane',
      createdAt: new Date('2020-01-01T00:00:00.000Z'),
    };
    const entity = TestEntity.create(props);
    expect(entity.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('should normalize createdAt to a Date instance', () => {
    const createdAt = new Date('2021-02-03T04:05:06.000Z');
    const props: TestEntityProps = {
      name: 'Alice',
      createdAt,
    };
    const entity = TestEntity.create(props);
    expect(entity.createdAt).toBeInstanceOf(Date);
    expect(entity.createdAt.toISOString()).toBe(createdAt.toISOString());
  });

  it('should default isActive to true when not provided', () => {
    const props: TestEntityProps = {
      name: 'Bob',
      createdAt: new Date('2021-02-03T04:05:06.000Z'),
    };
    const entity = TestEntity.create(props);
    expect(entity.isActive).toBe(true);
  });

  it('should activate and deactivate the entity', () => {
    const props: TestEntityProps = {
      name: 'Charlie',
      createdAt: new Date('2021-02-03T04:05:06.000Z'),
      isActive: false,
    };
    const entity = TestEntity.create(props);
    expect(entity.isActive).toBe(false);
    entity.activate();
    expect(entity.isActive).toBe(true);
    entity.deactivate();
    expect(entity.isActive).toBe(false);
  });

  it('should throw DomainError when id is not a valid UUID', () => {
    const props: TestEntityProps = {
      name: 'Invalid',
      createdAt: new Date('2021-02-03T04:05:06.000Z'),
    };
    expect(() => TestEntity.create(props, 'invalid-id')).toThrow(DomainError);
    try {
      TestEntity.create(props, 'invalid-id');
    } catch (e) {
      const err = e as DomainError;
      expect(err.code).toBe('INVALID_UUID');
      expect(err.context).toBeDefined();
      expect(err.context!.id).toBe('invalid-id');
    }
  });
});
