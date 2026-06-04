import { BusinessError } from "src/domain/errors/business.error";
import { CreateEmployeeValidator } from "src/domain/service/validators/employee/create-employee.validator";
import { EmployeeRoleEnum } from "src/domain/enums/employee-role.enum";
import { VALID_EMAIL, VALID_PHONE } from "../../../helpers/test-constants";

describe("CreateEmployeeValidator", () => {
  const validator = new CreateEmployeeValidator();

  it("accepte une commande valide", () => {
    expect(() =>
      validator.validate({
        fullName: "Jean Dupont",
        email: VALID_EMAIL,
        phone: VALID_PHONE,
        role: EmployeeRoleEnum.VENDEUR,
      }),
    ).not.toThrow();
  });

  it("rejette un nom vide", () => {
    expect(() =>
      validator.validate({
        fullName: " ",
        email: VALID_EMAIL,
        role: EmployeeRoleEnum.VENDEUR,
      }),
    ).toThrow(BusinessError);
  });

  it("rejette un rôle invalide", () => {
    expect(() =>
      validator.validate({
        fullName: "Jean",
        email: VALID_EMAIL,
        role: "invalid" as EmployeeRoleEnum,
      }),
    ).toThrow("ROLE_INVALID");
  });
});
