import { PaginatedResponse } from "src/domain/entities/paginated-response.entity";
import { BranchEntity } from "src/domain/entities/branch.entity";
export interface ListBranchQuery {
  page: number;
  limit: number;
  name?: string;
  code?: string;
  city?: string;
  isActive?: boolean;
}

export interface ListBranchInterfacePort {
  execute(query: ListBranchQuery): Promise<PaginatedResponse<BranchEntity>>;
}
