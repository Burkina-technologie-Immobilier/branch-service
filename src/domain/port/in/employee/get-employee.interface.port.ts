import { EmployeeEntity } from "src/domain/entities/employee.entity";
import { EmployeeRoleEnum } from "src/domain/enums/employee-role.enum";
export interface GetEmployeeQuery {
  publicId: string;
}

export interface GetEmployeeInterfacePort {
  execute(query: GetEmployeeQuery): Promise<EmployeeEntity | null>;
}
