import { ApplicationError } from "src/application/errors/application.error";
import { CodesError } from "src/application/errors/codes.error";
import { EmployeeEntity } from "src/domain/entities/employee.entity";
import { GetEmployeeInterfacePort, GetEmployeeQuery } from "src/domain/port/in/employee/get-employee.interface.port";
import { EmployeeRepositoryPort } from "src/domain/port/out/employee.repository.port";
import { GetEmployeeValidator } from "src/domain/service/validators/employee/get-employee.validator";

export class GetEmployeeUseCase implements GetEmployeeInterfacePort {
  constructor(
    private readonly repository: EmployeeRepositoryPort,
    private readonly validator: GetEmployeeValidator,
  ) {}

  async execute(query: GetEmployeeQuery): Promise<EmployeeEntity | null> {
    this.validator.validate(query);
    const entity = await this.repository.findByPublicId(query.publicId);
    if (!entity) {
      throw new ApplicationError(CodesError.EMPLOYEE_NOT_FOUND);
    }
    return entity;
  }
}
