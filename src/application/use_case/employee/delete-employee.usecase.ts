import { ApplicationError } from "src/application/errors/application.error";
import { CodesError } from "src/application/errors/codes.error";
import { DeleteEmployeeCommand, DeleteEmployeeInterfacePort } from "src/domain/port/in/employee/delete-employee.interface.port";
import { EmployeeRepositoryPort } from "src/domain/port/out/employee.repository.port";
import { DeleteEmployeeValidator } from "src/domain/service/validators/employee/delete-employee.validator";

export class DeleteEmployeeUseCase implements DeleteEmployeeInterfacePort {
  constructor(
    private readonly repository: EmployeeRepositoryPort,
    private readonly validator: DeleteEmployeeValidator,
  ) {}

  async execute(command: DeleteEmployeeCommand): Promise<void> {
    this.validator.validate(command);
    const entity = await this.repository.findByPublicId(command.publicId);
    if (!entity) {
      throw new ApplicationError(CodesError.EMPLOYEE_NOT_FOUND);
    }
    await this.repository.delete(command.publicId);
  }
}
