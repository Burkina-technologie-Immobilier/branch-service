import { ApplicationError } from "src/application/errors/application.error";
import { CodesError } from "src/application/errors/codes.error";
import { EmployeeEntity } from "src/domain/entities/employee.entity";
import { CreateEmployeeCommand, CreateEmployeeInterfacePort } from "src/domain/port/in/employee/create-employee.interface.port";
import { PublicIdGeneratorPort } from "src/domain/port/in/generate-public-id/generator-public-id.port";
import { BranchRepositoryPort } from "src/domain/port/out/branch.repository.port";
import { EmployeeRepositoryPort } from "src/domain/port/out/employee.repository.port";
import { MeublezonePermission } from "src/domain/enums/meublezone-permission.enum";
import { AccessGuard } from "src/domain/service/policies/access.guard";
import { EmployeeRolePolicy } from "src/domain/service/policies/employee-role.policy";
import { CreateEmployeeValidator } from "src/domain/service/validators/employee/create-employee.validator";

export class CreateEmployeeUseCase implements CreateEmployeeInterfacePort {
  constructor(
    private readonly repository: EmployeeRepositoryPort,
    private readonly branchRepository: BranchRepositoryPort,
    private readonly validator: CreateEmployeeValidator,
    private readonly publicIdGenerator: PublicIdGeneratorPort,
    private readonly access: AccessGuard,
    private readonly employeeRolePolicy: EmployeeRolePolicy,
  ) {}

  async execute(command: CreateEmployeeCommand): Promise<EmployeeEntity> {
    this.validator.validate(command);
    this.employeeRolePolicy.assertCanAssignRole(undefined, command.role);

    const existingEmail = await this.repository.findByEmail(command.email);
    if (existingEmail) {
      throw new ApplicationError(CodesError.EMAIL_ALREADY_EXISTS);
    }

    let branchId: string | null | undefined;
    if (command.branchPublicId) {
      const branch = await this.branchRepository.findByPublicId(command.branchPublicId);
      if (!branch?.id) {
        throw new ApplicationError(CodesError.BRANCH_REFERENCE_INVALID);
      }
      branchId = branch.id;
    }

    this.access.check({
      permission: MeublezonePermission.EMPLOYEE_WRITE,
      branchId: branchId ?? undefined,
    });

    const publicId = this.publicIdGenerator.generateNanoid();
    const employee = new EmployeeEntity({
      publicId,
      userId: command.userId ?? null,
      fullName: command.fullName,
      email: command.email,
      phone: command.phone ?? null,
      role: command.role,
      branchId: branchId ?? null,
      isActive: command.isActive ?? true,
      hiredAt: command.hiredAt ?? null,
    });

    return this.repository.save(employee);
  }
}
