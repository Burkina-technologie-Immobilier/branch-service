import { BranchTable } from "@prisma/client";
import { BranchEntity } from "src/domain/entities/branch.entity";

export class BranchDbMapper {
  static toDomain(row: BranchTable): BranchEntity {
    return new BranchEntity({
      id: row.id,
      publicId: row.public_id,
      code: row.code,
      name: row.name,
      city: row.city,
      address: row.address,
      email: row.email,
      phone: row.phone,
      managerId: row.manager_id,
      isActive: row.is_active,
      openedAt: row.opened_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  static toPersistence(entity: BranchEntity) {
    return {
      public_id: entity.publicId,
      code: entity.code ?? null,
      name: entity.name,
      city: entity.city ?? null,
      address: entity.address ?? null,
      email: entity.email ?? null,
      phone: entity.phone ?? null,
      manager_id: entity.managerId ?? null,
      is_active: entity.isActive,
      opened_at: entity.openedAt ?? null,
    };
  }
}
