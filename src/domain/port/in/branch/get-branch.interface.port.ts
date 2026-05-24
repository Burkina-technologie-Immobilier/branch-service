import { BranchEntity } from "src/domain/entities/branch.entity";
export interface GetBranchQuery {
  publicId: string;
}

export interface GetBranchInterfacePort {
  execute(query: GetBranchQuery): Promise<BranchEntity | null>;
}
