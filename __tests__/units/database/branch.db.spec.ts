import { BranchDbMapper } from "src/application/mapper/branch/branch-bd.mapper";
import { buildBranchEntity } from "../../helpers/branch.factory";

describe("BranchDbMapper", () => {
  it("mappe entité -> persistence", () => {
    const entity = buildBranchEntity();
    const row = BranchDbMapper.toPersistence(entity);
    expect(row.public_id).toBe(entity.publicId);
    expect(row.code).toBe("ABJ");
    expect(row.name).toBe(entity.name);
    expect(row.is_active).toBe(true);
  });

  it("mappe persistence -> domaine", () => {
    const entity = buildBranchEntity();
    const row = {
      id: entity.id!,
      public_id: entity.publicId,
      code: entity.code,
      name: entity.name,
      city: entity.city,
      address: entity.address,
      email: entity.email,
      phone: entity.phone,
      manager_id: entity.managerId,
      is_active: entity.isActive,
      opened_at: entity.openedAt,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const domain = BranchDbMapper.toDomain(row);
    expect(domain.publicId).toBe(entity.publicId);
    expect(domain.name).toBe(entity.name);
  });
});
