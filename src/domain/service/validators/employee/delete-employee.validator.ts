import { BusinessError } from "src/domain/errors/business.error";
import { CodesError } from "src/domain/errors/codes.error";
import { Utils } from "src/lib/utils.commons";
import { DeleteEmployeeCommand } from "src/domain/port/in/employee/delete-employee.interface.port";

export class DeleteEmployeeValidator {
  validate(command: DeleteEmployeeCommand): void {
    if (!Utils.nanoidRegex.test(command.publicId)) {
      throw new BusinessError(CodesError.PUBLIC_ID_INVALID);
    }
  }
}
