import { PaginatedResponse } from "src/domain/entities/paginated-response.entity";
import { EmployeeEntity } from "src/domain/entities/employee.entity";
import { ListEmployeeInterfacePort, ListEmployeeQuery } from "src/domain/port/in/employee/list-employee.interface.port";
import { BranchRepositoryPort } from "src/domain/port/out/branch.repository.port";
import { EmployeeRepositoryPort } from "src/domain/port/out/employee.repository.port";
import { ApplicationError } from "src/application/errors/application.error";
import { CodesError } from "src/application/errors/codes.error";
import { MeublezonePermission } from "src/domain/enums/meublezone-permission.enum";
import { AccessGuard } from "src/domain/service/policies/access.guard";

export class ListEmployeeUseCase implements ListEmployeeInterfacePort {
  constructor(
    private readonly repository: EmployeeRepositoryPort,
    private readonly branchRepository: BranchRepositoryPort,
    private readonly access: AccessGuard,
  ) {}

  async execute(query: ListEmployeeQuery): Promise<PaginatedResponse<EmployeeEntity>> {
    this.access.check({ permission: MeublezonePermission.EMPLOYEE_READ });
    let branchId: string | undefined;
    if (query.branchPublicId) {
      const branch = await this.branchRepository.findByPublicId(query.branchPublicId);
      if (!branch?.id) {
        throw new ApplicationError(CodesError.BRANCH_REFERENCE_INVALID);
      }
      branchId = branch.id;
    }
    branchId = this.access.resolveBranchFilter(branchId);

    const { data, total } = await this.repository.findWithPagination(query, branchId);
    const totalPages = Math.ceil(total / query.limit);
    return { data, total, page: query.page, limit: query.limit, totalPages };
  }
}
