import { BranchEntity } from "src/domain/entities/branch.entity";
export interface CreateBranchCommand {
  code?: string;
  name: string;
  city?: string;
  address?: string;
  email?: string;
  phone?: string;
  managerPublicId?: string;
  isActive?: boolean;
  openedAt?: Date;
}

export interface CreateBranchInterfacePort {
  execute(command: CreateBranchCommand): Promise<BranchEntity>;
}
