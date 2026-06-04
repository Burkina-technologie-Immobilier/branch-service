export interface BranchProps {
  readonly id?: string;
  publicId: string;
  code?: string | null;
  name: string;
  city?: string | null;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  managerId?: string | null;
  isActive: boolean;
  openedAt?: Date | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export class BranchEntity {
  constructor(private readonly props: BranchProps) {}

  get id(): string | undefined {
    return this.props.id;
  }

  get publicId(): string {
    return this.props.publicId;
  }

  get code(): string | null | undefined {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get city(): string | null | undefined {
    return this.props.city;
  }

  get address(): string | null | undefined {
    return this.props.address;
  }

  get email(): string | null | undefined {
    return this.props.email;
  }

  get phone(): string | null | undefined {
    return this.props.phone;
  }

  get managerId(): string | null | undefined {
    return this.props.managerId;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get openedAt(): Date | null | undefined {
    return this.props.openedAt;
  }

  update(updates: Partial<BranchProps>): BranchEntity {
    Object.assign(this.props, updates);
    return this;
  }
}
