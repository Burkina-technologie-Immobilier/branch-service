import { buildEmployeeEntity } from "../../helpers/employee.factory";
import { EmployeeRoleEnum } from "src/domain/enums/employee-role.enum";

describe("EmployeeEntity", () => {
  it("expose les propriétés métier", () => {
    const entity = buildEmployeeEntity();
    expect(entity.fullName).toBe("Kofi Mensah");
    expect(entity.role).toBe(EmployeeRoleEnum.VENDEUR);
    expect(entity.isActive).toBe(true);
  });

  it("met à jour les champs via update()", () => {
    const entity = buildEmployeeEntity();
    entity.update({ role: EmployeeRoleEnum.MANAGER });
    expect(entity.role).toBe(EmployeeRoleEnum.MANAGER);
  });
});
