import { EmployeeRoleEnum } from '../enums/employee-role.enum';

export interface EmployeeProps {
  readonly id?: string;
  publicId: string;
  userId?: string | null;
  fullName: string;
  email: string;
  phone?: string | null;
  role: EmployeeRoleEnum;
  branchId?: string | null;
  isActive: boolean;
  hiredAt?: Date | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export class EmployeeEntity {
  constructor(private readonly props: EmployeeProps) {}

  get id(): string | undefined {
    return this.props.id;
  }

  get publicId(): string {
    return this.props.publicId;
  }

  get userId(): string | null | undefined {
    return this.props.userId;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get email(): string {
    return this.props.email;
  }

  get phone(): string | null | undefined {
    return this.props.phone;
  }

  get role(): EmployeeRoleEnum {
    return this.props.role;
  }

  get branchId(): string | null | undefined {
    return this.props.branchId;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get hiredAt(): Date | null | undefined {
    return this.props.hiredAt;
  }

  update(updates: Partial<EmployeeProps>): EmployeeEntity {
    Object.assign(this.props, updates);
    return this;
  }
}
