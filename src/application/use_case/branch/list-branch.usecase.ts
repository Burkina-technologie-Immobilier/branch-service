import { PaginatedResponse } from "src/domain/entities/paginated-response.entity";
import { BranchEntity } from "src/domain/entities/branch.entity";
import { ListBranchInterfacePort, ListBranchQuery } from "src/domain/port/in/branch/list-branch.interface.port";
import { BranchRepositoryPort } from "src/domain/port/out/branch.repository.port";

export class ListBranchUseCase implements ListBranchInterfacePort {
  constructor(private readonly repository: BranchRepositoryPort) {}

  async execute(query: ListBranchQuery): Promise<PaginatedResponse<BranchEntity>> {
    const { data, total } = await this.repository.findWithPagination(query);
    const totalPages = Math.ceil(total / query.limit);
    return { data, total, page: query.page, limit: query.limit, totalPages };
  }
}
