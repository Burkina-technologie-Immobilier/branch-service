import { BusinessError } from "src/domain/errors/business.error";
import { DeleteBranchValidator } from "src/domain/service/validators/branch/delete-branch.validator";
import { VALID_PUBLIC_ID } from "../../../helpers/test-constants";

describe("DeleteBranchValidator", () => {

  it("rejette publicId invalide", () => {
    const validator = new DeleteBranchValidator();
    expect(() => validator.validate({ publicId: 'invalid' })).toThrow(BusinessError);
    expect(() => validator.validate({ publicId: 'invalid' })).toThrow("PUBLIC_ID_INVALID");
  });
});
