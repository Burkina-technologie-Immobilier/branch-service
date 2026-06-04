import { CreateEmployeeDto } from "src/application/dto/employee/create-employee.dto";
import { ListEmployeeDto } from "src/application/dto/employee/list-employee.dto";
import { ResponseEmployeeDto } from "src/application/dto/employee/response-employee.dto";
import { UpdateEmployeeDto } from "src/application/dto/employee/update-employee.dto";
import { EmployeeEntity } from "src/domain/entities/employee.entity";
import { CreateEmployeeCommand } from "src/domain/port/in/employee/create-employee.interface.port";
import { ListEmployeeQuery } from "src/domain/port/in/employee/list-employee.interface.port";
import { UpdateEmployeeCommand } from "src/domain/port/in/employee/update-employee.interface.port";

export class EmployeeHttpMapper {
  static toCreateCommand(dto: CreateEmployeeDto): CreateEmployeeCommand {
    return {
      userId: dto.userId,
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      role: dto.role,
      branchPublicId: dto.branchPublicId,
      isActive: dto.isActive,
      hiredAt: dto.hiredAt ? new Date(dto.hiredAt) : undefined,
    };
  }

  static toUpdateCommand(dto: UpdateEmployeeDto): UpdateEmployeeCommand {
    return {
      userId: dto.userId,
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      role: dto.role,
      branchPublicId: dto.branchPublicId,
      isActive: dto.isActive,
      hiredAt: dto.hiredAt === undefined ? undefined : dto.hiredAt ? new Date(dto.hiredAt) : null,
    };
  }

  static toListQuery(dto: ListEmployeeDto): ListEmployeeQuery {
    return {
      page: dto.page,
      limit: dto.limit,
      fullName: dto.fullName,
      email: dto.email,
      role: dto.role,
      branchPublicId: dto.branchPublicId,
      isActive: dto.isActive,
    };
  }

  static toResponse(entity: EmployeeEntity, branchPublicId?: string | null): ResponseEmployeeDto {
    return {
      publicId: entity.publicId,
      fullName: entity.fullName,
      email: entity.email,
      phone: entity.phone,
      role: entity.role,
      branchPublicId: branchPublicId ?? null,
      isActive: entity.isActive,
      hiredAt: entity.hiredAt,
    };
  }
}
