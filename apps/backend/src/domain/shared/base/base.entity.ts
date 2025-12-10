import { CreatedAtVO, UuidVO, UpdatedAtVO } from '../value-objects';
import { BaseEntityProps } from './base.entity.props';

export abstract class BaseEntity<TProps extends BaseEntityProps> {
  protected readonly _id: string;
  protected props: TProps;

  protected constructor(props: TProps, id?: string) {
    const uuid = UuidVO.create(id).value;
    const createdAt = CreatedAtVO.create(props.createdAt).value;

    this._id = uuid;
    this.props = {
      ...props,
      createdAt,
      updatedAt: props.updatedAt ?? null,
      isActive: props.isActive ?? true,
    };
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this.props.createdAt as Date;
  }
  get updatedAt(): Date | null {
    return this.props.updatedAt ?? null;
  }

  get isActive(): boolean {
    return this.props.isActive ?? true;
  }

  activate(): void {
    this.props.isActive = true;
  }

  deactivate(): void {
    this.props.isActive = false;
  }

  updateTimestamp(date: Date): void {
    this.props.updatedAt = UpdatedAtVO.create(date).value;
  }
}
