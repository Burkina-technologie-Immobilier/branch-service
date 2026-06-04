import { Inject, Injectable } from '@nestjs/common';
import { ResponseEmployeeDto } from 'src/application/dto/employee/response-employee.dto';
import { EmployeeHttpMapper } from 'src/application/mapper/employee/employee-http.mapper';
import { EmployeeEntity } from 'src/domain/entities/employee.entity';
import type { BranchRepositoryPort } from 'src/domain/port/out/branch.repository.port';

@Injectable()
export class EmployeeResponseAdapter {
  constructor(
    @Inject('BranchRepositoryPort')
    private readonly branchRepository: BranchRepositoryPort,
  ) {}

  async toResponse(entity: EmployeeEntity): Promise<ResponseEmployeeDto> {
    let branchPublicId: string | null = null;
    if (entity.branchId) {
      const branch = await this.branchRepository.findById(entity.branchId);
      branchPublicId = branch?.publicId ?? null;
    }
    return EmployeeHttpMapper.toResponse(entity, branchPublicId);
  }
}
