import { BusinessError } from "src/domain/errors/business.error";
import { CodesError } from "src/domain/errors/codes.error";
import { Utils } from "src/lib/utils.commons";
import { DeleteBranchCommand } from "src/domain/port/in/branch/delete-branch.interface.port";

export class DeleteBranchValidator {
  validate(command: DeleteBranchCommand): void {
    if (!Utils.nanoidRegex.test(command.publicId)) {
      throw new BusinessError(CodesError.PUBLIC_ID_INVALID);
    }
  }
}
