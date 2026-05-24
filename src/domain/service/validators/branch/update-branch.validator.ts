import { BusinessError } from "src/domain/errors/business.error";
import { CodesError } from "src/domain/errors/codes.error";
import { Utils } from "src/lib/utils.commons";
import { UpdateBranchCommand } from "src/domain/port/in/branch/update-branch.interface.port";

export class UpdateBranchValidator {
  validate(command: UpdateBranchCommand): void {
    if (command.name !== undefined && !command.name?.trim()) {
      throw new BusinessError(CodesError.NAME_REQUIRED);
    }
    if (command.code && command.code.length > 10) {
      throw new BusinessError(CodesError.CODE_INVALID);
    }
    if (command.email && !Utils.emailRegex.test(command.email)) {
      throw new BusinessError(CodesError.EMAIL_INVALID);
    }
    if (command.phone && !Utils.phoneRegex.test(command.phone)) {
      throw new BusinessError(CodesError.PHONE_INVALID);
    }
  }
}
