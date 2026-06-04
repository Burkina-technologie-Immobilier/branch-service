import { ApplicationError } from "src/application/errors/application.error";
import { CodesError } from "src/application/errors/codes.error";
import { EmployeeEntity } from "src/domain/entities/employee.entity";
import { GetEmployeeQuery } from "src/domain/port/in/employee/get-employee.interface.port";
import { UpdateEmployeeCommand, UpdateEmployeeInterfacePort } from "src/domain/port/in/employee/update-employee.interface.port";
import { BranchRepositoryPort } from "src/domain/port/out/branch.repository.port";
import { EmployeeRepositoryPort } from "src/domain/port/out/employee.repository.port";
import { MeublezonePermission } from "src/domain/enums/meublezone-permission.enum";
import { AccessGuard } from "src/domain/service/policies/access.guard";
import { EmployeeRolePolicy } from "src/domain/service/policies/employee-role.policy";
import { UpdateEmployeeValidator } from "src/domain/service/validators/employee/update-employee.validator";

export class UpdateEmployeeUseCase implements UpdateEmployeeInterfacePort {
  constructor(
    private readonly repository: EmployeeRepositoryPort,
    private readonly branchRepository: BranchRepositoryPort,
    private readonly validator: UpdateEmployeeValidator,
    private readonly access: AccessGuard,
    private readonly employeeRolePolicy: EmployeeRolePolicy,
  ) {}

  async execute(query: GetEmployeeQuery, command: UpdateEmployeeCommand): Promise<EmployeeEntity> {
    this.validator.validate(command);
    const entity = await this.repository.findByPublicId(query.publicId);
    if (!entity) {
      throw new ApplicationError(CodesError.EMPLOYEE_NOT_FOUND);
    }
    this.access.check({
      permission: MeublezonePermission.EMPLOYEE_WRITE,
      branchId: entity.branchId,
    });
    if (command.role) {
      this.employeeRolePolicy.assertCanAssignRole(entity.role, command.role);
    }

    if (command.email && command.email !== entity.email) {
      const existingEmail = await this.repository.findByEmail(command.email);
      if (existingEmail) {
        throw new ApplicationError(CodesError.EMAIL_ALREADY_EXISTS);
      }
    }

    let branchId = entity.branchId;
    if (command.branchPublicId !== undefined) {
      if (command.branchPublicId === null) {
        branchId = null;
      } else {
        const branch = await this.branchRepository.findByPublicId(command.branchPublicId);
        if (!branch?.id) {
          throw new ApplicationError(CodesError.BRANCH_REFERENCE_INVALID);
        }
        branchId = branch.id;
      }
    }

    entity.update({
      userId: command.userId !== undefined ? command.userId : entity.userId,
      fullName: command.fullName ?? entity.fullName,
      email: command.email ?? entity.email,
      phone: command.phone !== undefined ? command.phone : entity.phone,
      role: command.role ?? entity.role,
      branchId,
      isActive: command.isActive ?? entity.isActive,
      hiredAt: command.hiredAt !== undefined ? command.hiredAt : entity.hiredAt,
    });

    return this.repository.save(entity);
  }
}
