import { BusinessError } from "src/domain/errors/business.error";
import { CodesError } from "src/domain/errors/codes.error";
import { Utils } from "src/lib/utils.commons";
import { GetBranchQuery } from "src/domain/port/in/branch/get-branch.interface.port";

export class GetBranchValidator {
  validate(query: GetBranchQuery): void {
    if (!Utils.nanoidRegex.test(query.publicId)) {
      throw new BusinessError(CodesError.PUBLIC_ID_INVALID);
    }
  }
}
