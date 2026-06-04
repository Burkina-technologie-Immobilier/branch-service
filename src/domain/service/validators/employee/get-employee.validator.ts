import { BusinessError } from "src/domain/errors/business.error";
import { CodesError } from "src/domain/errors/codes.error";
import { Utils } from "src/lib/utils.commons";
import { GetEmployeeQuery } from "src/domain/port/in/employee/get-employee.interface.port";

export class GetEmployeeValidator {
  validate(query: GetEmployeeQuery): void {
    if (!Utils.nanoidRegex.test(query.publicId)) {
      throw new BusinessError(CodesError.PUBLIC_ID_INVALID);
    }
  }
}
