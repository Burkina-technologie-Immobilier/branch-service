import { BranchEntity } from "src/domain/entities/branch.entity";
export interface DeleteBranchCommand {
  publicId: string;
}

export interface DeleteBranchInterfacePort {
  execute(command: DeleteBranchCommand): Promise<void>;
}
