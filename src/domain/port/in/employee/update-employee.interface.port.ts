import { EmployeeEntity } from "src/domain/entities/employee.entity";
import { EmployeeRoleEnum } from "src/domain/enums/employee-role.enum";
import { GetEmployeeQuery } from "./get-employee.interface.port";
export interface UpdateEmployeeCommand {
  userId?: string | null;
  fullName?: string;
  email?: string;
  phone?: string | null;
  role?: EmployeeRoleEnum;
  branchPublicId?: string | null;
  isActive?: boolean;
  hiredAt?: Date | null;
}

export interface UpdateEmployeeInterfacePort {
  execute(query: GetEmployeeQuery, command: UpdateEmployeeCommand): Promise<EmployeeEntity>;
}
