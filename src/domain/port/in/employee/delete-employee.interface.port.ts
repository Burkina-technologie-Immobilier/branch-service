import { EmployeeEntity } from "src/domain/entities/employee.entity";
import { EmployeeRoleEnum } from "src/domain/enums/employee-role.enum";
export interface DeleteEmployeeCommand {
  publicId: string;
}

export interface DeleteEmployeeInterfacePort {
  execute(command: DeleteEmployeeCommand): Promise<void>;
}
