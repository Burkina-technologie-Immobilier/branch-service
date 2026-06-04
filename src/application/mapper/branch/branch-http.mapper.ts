import { CreateBranchDto } from "src/application/dto/branch/create-branch.dto";
import { ListBranchDto } from "src/application/dto/branch/list-branch.dto";
import { ResponseBranchDto } from "src/application/dto/branch/response-branch.dto";
import { UpdateBranchDto } from "src/application/dto/branch/update-branch.dto";
import { BranchEntity } from "src/domain/entities/branch.entity";
import { CreateBranchCommand } from "src/domain/port/in/branch/create-branch.interface.port";
import { ListBranchQuery } from "src/domain/port/in/branch/list-branch.interface.port";
import { UpdateBranchCommand } from "src/domain/port/in/branch/update-branch.interface.port";

export class BranchHttpMapper {
  static toCreateCommand(dto: CreateBranchDto): CreateBranchCommand {
    return {
      code: dto.code,
      name: dto.name,
      city: dto.city,
      address: dto.address,
      email: dto.email,
      phone: dto.phone,
      managerPublicId: dto.managerPublicId,
      isActive: dto.isActive,
      openedAt: dto.openedAt ? new Date(dto.openedAt) : undefined,
    };
  }

  static toUpdateCommand(dto: UpdateBranchDto): UpdateBranchCommand {
    return {
      code: dto.code,
      name: dto.name,
      city: dto.city,
      address: dto.address,
      email: dto.email,
      phone: dto.phone,
      managerPublicId: dto.managerPublicId,
      isActive: dto.isActive,
      openedAt: dto.openedAt === undefined ? undefined : dto.openedAt ? new Date(dto.openedAt) : null,
    };
  }

  static toListQuery(dto: ListBranchDto): ListBranchQuery {
    return {
      page: dto.page,
      limit: dto.limit,
      name: dto.name,
      code: dto.code,
      city: dto.city,
      isActive: dto.isActive,
    };
  }

  static toResponse(entity: BranchEntity): ResponseBranchDto {
    return {
      id: entity.id!,
      publicId: entity.publicId,
      code: entity.code,
      name: entity.name,
      city: entity.city,
      address: entity.address,
      email: entity.email,
      phone: entity.phone,
      isActive: entity.isActive,
      openedAt: entity.openedAt,
    };
  }
}
