import { BranchEntity } from "src/domain/entities/branch.entity";
import { ListBranchQuery } from "../in/branch/list-branch.interface.port";

export interface BranchRepositoryPort {
  save(entity: BranchEntity): Promise<BranchEntity>;
  findById(id: string): Promise<BranchEntity | null>;
  findByPublicId(publicId: string): Promise<BranchEntity | null>;
  findByCode(code: string): Promise<BranchEntity | null>;
  findWithPagination(query: ListBranchQuery): Promise<{ data: BranchEntity[]; total: number }>;
  delete(publicId: string): Promise<void>;
}
