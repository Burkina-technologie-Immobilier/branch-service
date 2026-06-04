import { PaginatedResponse } from "src/domain/entities/paginated-response.entity";
import { EmployeeEntity } from "src/domain/entities/employee.entity";
import { EmployeeRoleEnum } from "src/domain/enums/employee-role.enum";
export interface ListEmployeeQuery {
  page: number;
  limit: number;
  fullName?: string;
  email?: string;
  role?: EmployeeRoleEnum;
  branchPublicId?: string;
  isActive?: boolean;
}

export interface ListEmployeeInterfacePort {
  execute(query: ListEmployeeQuery): Promise<PaginatedResponse<EmployeeEntity>>;
}
