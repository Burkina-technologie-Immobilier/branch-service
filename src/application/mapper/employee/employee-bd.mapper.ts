import { EmployeeTable } from "@prisma/client";
import { EmployeeEntity } from "src/domain/entities/employee.entity";
import { EmployeeRoleEnum } from "src/domain/enums/employee-role.enum";

export class EmployeeDbMapper {
  static toDomain(row: EmployeeTable): EmployeeEntity {
    return new EmployeeEntity({
      id: row.id,
      publicId: row.public_id,
      userId: row.user_id,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone,
      role: row.role as EmployeeRoleEnum,
      branchId: row.branch_id,
      isActive: row.is_active,
      hiredAt: row.hired_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  static toPersistence(entity: EmployeeEntity) {
    return {
      public_id: entity.publicId,
      user_id: entity.userId ?? null,
      full_name: entity.fullName,
      email: entity.email,
      phone: entity.phone ?? null,
      role: entity.role,
      branch_id: entity.branchId ?? null,
      is_active: entity.isActive,
      hired_at: entity.hiredAt ?? null,
    };
  }
}
