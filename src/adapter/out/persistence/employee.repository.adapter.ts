import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { EmployeeDbMapper } from 'src/application/mapper/employee/employee-bd.mapper';
import { EmployeeEntity } from 'src/domain/entities/employee.entity';
import { ListEmployeeQuery } from 'src/domain/port/in/employee/list-employee.interface.port';
import { EmployeeRepositoryPort } from 'src/domain/port/out/employee.repository.port';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';

@Injectable()
export class EmployeeRepositoryAdapter implements EmployeeRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(entity: EmployeeEntity): Promise<EmployeeEntity> {
    const data = EmployeeDbMapper.toPersistence(entity);

    const saved = await this.prisma.employeeTable.upsert({
      where: { public_id: entity.publicId },
      update: data,
      create: data,
    });

    return EmployeeDbMapper.toDomain(saved);
  }

  async findById(id: string): Promise<EmployeeEntity | null> {
    const row = await this.prisma.employeeTable.findUnique({ where: { id } });
    return row ? EmployeeDbMapper.toDomain(row) : null;
  }

  async findByPublicId(publicId: string): Promise<EmployeeEntity | null> {
    const row = await this.prisma.employeeTable.findUnique({
      where: { public_id: publicId },
    });
    return row ? EmployeeDbMapper.toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<EmployeeEntity | null> {
    const row = await this.prisma.employeeTable.findUnique({ where: { email } });
    return row ? EmployeeDbMapper.toDomain(row) : null;
  }

  async findWithPagination(
    query: ListEmployeeQuery,
    branchId?: string,
  ): Promise<{ data: EmployeeEntity[]; total: number }> {
    const { page, limit, fullName, email, role, isActive } = query;
    const where: Prisma.EmployeeTableWhereInput = {};

    if (fullName) {
      where.full_name = { contains: fullName, mode: 'insensitive' };
    }
    if (email) {
      where.email = { contains: email, mode: 'insensitive' };
    }
    if (role) {
      where.role = role;
    }
    if (isActive !== undefined) {
      where.is_active = isActive;
    }
    if (branchId) {
      where.branch_id = branchId;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.employeeTable.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.employeeTable.count({ where }),
    ]);

    return { data: data.map(EmployeeDbMapper.toDomain), total };
  }

  async delete(publicId: string): Promise<void> {
    await this.prisma.employeeTable.delete({ where: { public_id: publicId } });
  }
}
