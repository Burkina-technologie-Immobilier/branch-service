import { EmployeeDbMapper } from "src/application/mapper/employee/employee-bd.mapper";
import { buildEmployeeEntity } from "../../helpers/employee.factory";
import { EmployeeRoleEnum } from "src/domain/enums/employee-role.enum";

describe("EmployeeDbMapper", () => {
  it("mappe entité -> persistence", () => {
    const entity = buildEmployeeEntity();
    const row = EmployeeDbMapper.toPersistence(entity);
    expect(row.public_id).toBe(entity.publicId);
    expect(row.full_name).toBe(entity.fullName);
    expect(row.role).toBe(EmployeeRoleEnum.VENDEUR);
  });

  it("mappe persistence -> domaine", () => {
    const entity = buildEmployeeEntity();
    const row = {
      id: entity.id!,
      public_id: entity.publicId,
      user_id: null,
      full_name: entity.fullName,
      email: entity.email,
      phone: entity.phone,
      role: entity.role,
      branch_id: null,
      is_active: true,
      hired_at: entity.hiredAt,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const domain = EmployeeDbMapper.toDomain(row);
    expect(domain.email).toBe(entity.email);
    expect(domain.role).toBe(EmployeeRoleEnum.VENDEUR);
  });
});
