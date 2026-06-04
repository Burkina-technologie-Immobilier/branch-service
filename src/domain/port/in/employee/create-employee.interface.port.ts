import { EmployeeEntity } from "src/domain/entities/employee.entity";
import { EmployeeRoleEnum } from "src/domain/enums/employee-role.enum";
export interface CreateEmployeeCommand {
  userId?: string;
  fullName: string;
  email: string;
  phone?: string;
  role: EmployeeRoleEnum;
  branchPublicId?: string;
  isActive?: boolean;
  hiredAt?: Date;
}

export interface CreateEmployeeInterfacePort {
  execute(command: CreateEmployeeCommand): Promise<EmployeeEntity>;
}
