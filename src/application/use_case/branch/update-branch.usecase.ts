import { ApplicationError } from "src/application/errors/application.error";
import { CodesError } from "src/application/errors/codes.error";
import { BranchEntity } from "src/domain/entities/branch.entity";
import { GetBranchQuery } from "src/domain/port/in/branch/get-branch.interface.port";
import { UpdateBranchCommand, UpdateBranchInterfacePort } from "src/domain/port/in/branch/update-branch.interface.port";
import { BranchRepositoryPort } from "src/domain/port/out/branch.repository.port";
import { EmployeeRepositoryPort } from "src/domain/port/out/employee.repository.port";
import { MeublezonePermission } from "src/domain/enums/meublezone-permission.enum";
import { AccessGuard } from "src/domain/service/policies/access.guard";
import { UpdateBranchValidator } from "src/domain/service/validators/branch/update-branch.validator";

export class UpdateBranchUseCase implements UpdateBranchInterfacePort {
  constructor(
    private readonly repository: BranchRepositoryPort,
    private readonly employeeRepository: EmployeeRepositoryPort,
    private readonly validator: UpdateBranchValidator,
    private readonly access: AccessGuard,
  ) {}

  async execute(query: GetBranchQuery, command: UpdateBranchCommand): Promise<BranchEntity> {
    this.validator.validate(command);
    const entity = await this.repository.findByPublicId(query.publicId);
    if (!entity) {
      throw new ApplicationError(CodesError.BRANCH_NOT_FOUND);
    }
    this.access.check({
      permission: MeublezonePermission.BRANCH_WRITE,
      branchId: entity.id,
    });

    if (command.code && command.code !== entity.code) {
      const existingCode = await this.repository.findByCode(command.code);
      if (existingCode) {
        throw new ApplicationError(CodesError.DUPLICATE_BRANCH_CODE);
      }
    }

    let managerId = entity.managerId;
    if (command.managerPublicId !== undefined) {
      if (command.managerPublicId === null) {
        managerId = null;
      } else {
        const manager = await this.employeeRepository.findByPublicId(command.managerPublicId);
        if (!manager?.id) {
          throw new ApplicationError(CodesError.MANAGER_REFERENCE_INVALID);
        }
        managerId = manager.id;
      }
    }

    entity.update({
      code: command.code ?? entity.code,
      name: command.name ?? entity.name,
      city: command.city !== undefined ? command.city : entity.city,
      address: command.address !== undefined ? command.address : entity.address,
      email: command.email !== undefined ? command.email : entity.email,
      phone: command.phone !== undefined ? command.phone : entity.phone,
      managerId,
      isActive: command.isActive ?? entity.isActive,
      openedAt: command.openedAt !== undefined ? command.openedAt : entity.openedAt,
    });

    return this.repository.save(entity);
  }
}
