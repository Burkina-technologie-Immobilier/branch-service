import { ApplicationError } from "src/application/errors/application.error";
import { CodesError } from "src/application/errors/codes.error";
import { BranchEntity } from "src/domain/entities/branch.entity";
import { CreateBranchCommand, CreateBranchInterfacePort } from "src/domain/port/in/branch/create-branch.interface.port";
import { PublicIdGeneratorPort } from "src/domain/port/in/generate-public-id/generator-public-id.port";
import { BranchRepositoryPort } from "src/domain/port/out/branch.repository.port";
import { EmployeeRepositoryPort } from "src/domain/port/out/employee.repository.port";
import { MeublezonePermission } from "src/domain/enums/meublezone-permission.enum";
import { AccessGuard } from "src/domain/service/policies/access.guard";
import { CreateBranchValidator } from "src/domain/service/validators/branch/create-branch.validator";

export class CreateBranchUseCase implements CreateBranchInterfacePort {
  constructor(
    private readonly repository: BranchRepositoryPort,
    private readonly employeeRepository: EmployeeRepositoryPort,
    private readonly validator: CreateBranchValidator,
    private readonly publicIdGenerator: PublicIdGeneratorPort,
    private readonly access: AccessGuard,
  ) {}

  async execute(command: CreateBranchCommand): Promise<BranchEntity> {
    this.access.check({
      permission: MeublezonePermission.BRANCH_WRITE,
      siegeOnly: true,
    });
    this.validator.validate(command);

    if (command.code) {
      const existingCode = await this.repository.findByCode(command.code);
      if (existingCode) {
        throw new ApplicationError(CodesError.DUPLICATE_BRANCH_CODE);
      }
    }

    let managerId: string | null | undefined;
    if (command.managerPublicId) {
      const manager = await this.employeeRepository.findByPublicId(command.managerPublicId);
      if (!manager?.id) {
        throw new ApplicationError(CodesError.MANAGER_REFERENCE_INVALID);
      }
      managerId = manager.id;
    }

    const publicId = this.publicIdGenerator.generateNanoid();
    const branch = new BranchEntity({
      publicId,
      code: command.code ?? null,
      name: command.name,
      city: command.city ?? null,
      address: command.address ?? null,
      email: command.email ?? null,
      phone: command.phone ?? null,
      managerId: managerId ?? null,
      isActive: command.isActive ?? true,
      openedAt: command.openedAt ?? null,
    });

    return this.repository.save(branch);
  }
}
