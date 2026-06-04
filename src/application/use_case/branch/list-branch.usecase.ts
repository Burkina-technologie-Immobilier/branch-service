import { PaginatedResponse } from "src/domain/entities/paginated-response.entity";
import { BranchEntity } from "src/domain/entities/branch.entity";
import { ListBranchInterfacePort, ListBranchQuery } from "src/domain/port/in/branch/list-branch.interface.port";
import { MeublezonePermission } from "src/domain/enums/meublezone-permission.enum";
import { BranchRepositoryPort } from "src/domain/port/out/branch.repository.port";
import { AccessGuard } from "src/domain/service/policies/access.guard";
import { SECURITY_CONTEXT_PORT, SecurityContextPort } from "src/domain/port/out/security-context.port";

export class ListBranchUseCase implements ListBranchInterfacePort {
  constructor(
    private readonly repository: BranchRepositoryPort,
    private readonly access: AccessGuard,
    private readonly securityContext: SecurityContextPort,
  ) {}

  async execute(query: ListBranchQuery): Promise<PaginatedResponse<BranchEntity>> {
    this.access.check({ permission: MeublezonePermission.BRANCH_READ });
    const ctx = this.securityContext.get();
    if (ctx.enforcePolicies && !ctx.isSiege() && ctx.branchId) {
      const branch = await this.repository.findById(ctx.branchId);
      return {
        data: branch ? [branch] : [],
        total: branch ? 1 : 0,
        page: 1,
        limit: query.limit,
        totalPages: branch ? 1 : 0,
      };
    }
    const { data, total } = await this.repository.findWithPagination(query);
    const totalPages = Math.ceil(total / query.limit);
    return { data, total, page: query.page, limit: query.limit, totalPages };
  }
}
