import { buildBranchEntity } from "../../helpers/branch.factory";

describe("BranchEntity", () => {
  it("expose les propriétés métier", () => {
    const entity = buildBranchEntity();
    expect(entity.publicId).toBe("V1StGXR8_Z5jdHi6B-myT");
    expect(entity.code).toBe("ABJ");
    expect(entity.name).toBe("Filiale Abidjan");
    expect(entity.isActive).toBe(true);
  });

  it("met à jour les champs via update()", () => {
    const entity = buildBranchEntity();
    entity.update({ name: "Nouveau nom", isActive: false });
    expect(entity.name).toBe("Nouveau nom");
    expect(entity.isActive).toBe(false);
  });
});
