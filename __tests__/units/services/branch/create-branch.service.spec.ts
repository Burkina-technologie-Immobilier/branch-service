import { BusinessError } from "src/domain/errors/business.error";
import { CreateBranchValidator } from "src/domain/service/validators/branch/create-branch.validator";
import { VALID_PUBLIC_ID } from "../../../helpers/test-constants";

describe("CreateBranchValidator", () => {
  it("accepte une commande valide", () => {
    const validator = new CreateBranchValidator();
    expect(() => validator.validate({ name: 'Filiale' })).not.toThrow();
  });
  it("rejette name vide", () => {
    const validator = new CreateBranchValidator();
    expect(() => validator.validate({ name: '  ' })).toThrow(BusinessError);
    expect(() => validator.validate({ name: '  ' })).toThrow("NAME_REQUIRED");
  });
  it("rejette code trop long", () => {
    const validator = new CreateBranchValidator();
    expect(() => validator.validate({ name: 'X', code: 'ABCDEFGHIJK' })).toThrow(BusinessError);
    expect(() => validator.validate({ name: 'X', code: 'ABCDEFGHIJK' })).toThrow("CODE_INVALID");
  });
  it("rejette email invalide", () => {
    const validator = new CreateBranchValidator();
    expect(() => validator.validate({ name: 'X', email: 'bad' })).toThrow(BusinessError);
    expect(() => validator.validate({ name: 'X', email: 'bad' })).toThrow("EMAIL_INVALID");
  });
});
