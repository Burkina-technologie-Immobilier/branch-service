import { BusinessError } from "src/domain/errors/business.error";
import { CodesError } from "src/domain/errors/codes.error";
import { Utils } from "src/lib/utils.commons";
import { UpdateEmployeeCommand } from "src/domain/port/in/employee/update-employee.interface.port";
import { EmployeeRoleEnum } from "src/domain/enums/employee-role.enum";

export class UpdateEmployeeValidator {
  validate(command: UpdateEmployeeCommand): void {
    if (command.fullName !== undefined && !command.fullName?.trim()) {
      throw new BusinessError(CodesError.NAME_REQUIRED);
    }
    if (command.email && !Utils.emailRegex.test(command.email)) {
      throw new BusinessError(CodesError.EMAIL_INVALID);
    }
    if (command.phone && !Utils.phoneRegex.test(command.phone)) {
      throw new BusinessError(CodesError.PHONE_INVALID);
    }
    if (command.role && !Object.values(EmployeeRoleEnum).includes(command.role)) {
      throw new BusinessError(CodesError.ROLE_INVALID);
    }
    if (command.userId && !Utils.uuidRegex.test(command.userId)) {
      throw new BusinessError(CodesError.BRANCH_ID_INVALID);
    }
  }
}
