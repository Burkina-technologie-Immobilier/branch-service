import { BusinessError } from "src/domain/errors/business.error";
import { GetBranchValidator } from "src/domain/service/validators/branch/get-branch.validator";
import { VALID_PUBLIC_ID } from "../../../helpers/test-constants";

describe("GetBranchValidator", () => {

  it("rejette publicId invalide", () => {
    const validator = new GetBranchValidator();
    expect(() => validator.validate({ publicId: 'short' })).toThrow(BusinessError);
    expect(() => validator.validate({ publicId: 'short' })).toThrow("PUBLIC_ID_INVALID");
  });
});
