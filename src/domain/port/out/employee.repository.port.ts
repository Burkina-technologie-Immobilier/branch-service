import { EmployeeEntity } from "src/domain/entities/employee.entity";
import { ListEmployeeQuery } from "../in/employee/list-employee.interface.port";

export interface EmployeeRepositoryPort {
  save(entity: EmployeeEntity): Promise<EmployeeEntity>;
  findById(id: string): Promise<EmployeeEntity | null>;
  findByPublicId(publicId: string): Promise<EmployeeEntity | null>;
  findByEmail(email: string): Promise<EmployeeEntity | null>;
  findWithPagination(query: ListEmployeeQuery, branchId?: string): Promise<{ data: EmployeeEntity[]; total: number }>;
  delete(publicId: string): Promise<void>;
}
