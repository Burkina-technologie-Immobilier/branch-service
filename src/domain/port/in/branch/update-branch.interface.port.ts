import { BranchEntity } from "src/domain/entities/branch.entity";
import { GetBranchQuery } from "./get-branch.interface.port";
export interface UpdateBranchCommand {
  code?: string;
  name?: string;
  city?: string;
  address?: string;
  email?: string;
  phone?: string;
  managerPublicId?: string | null;
  isActive?: boolean;
  openedAt?: Date | null;
}

export interface UpdateBranchInterfacePort {
  execute(query: GetBranchQuery, command: UpdateBranchCommand): Promise<BranchEntity>;
}
