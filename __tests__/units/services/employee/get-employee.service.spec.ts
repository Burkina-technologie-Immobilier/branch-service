import { BusinessError } from "src/domain/errors/business.error";
import { GetEmployeeValidator } from "src/domain/service/validators/employee/get-employee.validator";
import { VALID_PUBLIC_ID } from "../../../helpers/test-constants";

describe("GetEmployeeValidator", () => {
  it("accepte un publicId valide", () => {
    const validator = new GetEmployeeValidator();
    expect(() => validator.validate({ publicId: VALID_PUBLIC_ID })).not.toThrow();
  });

  it("rejette un publicId invalide", () => {
    const validator = new GetEmployeeValidator();
    expect(() => validator.validate({ publicId: "bad" })).toThrow(BusinessError);
  });
});
