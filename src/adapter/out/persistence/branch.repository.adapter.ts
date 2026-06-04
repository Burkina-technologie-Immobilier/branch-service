import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BranchDbMapper } from 'src/application/mapper/branch/branch-bd.mapper';
import { BranchEntity } from 'src/domain/entities/branch.entity';
import { ListBranchQuery } from 'src/domain/port/in/branch/list-branch.interface.port';
import { BranchRepositoryPort } from 'src/domain/port/out/branch.repository.port';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';

@Injectable()
export class BranchRepositoryAdapter implements BranchRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(entity: BranchEntity): Promise<BranchEntity> {
    const data = BranchDbMapper.toPersistence(entity);

    const saved = await this.prisma.branchTable.upsert({
      where: { public_id: entity.publicId },
      update: data,
      create: data,
    });

    return BranchDbMapper.toDomain(saved);
  }

  async findById(id: string): Promise<BranchEntity | null> {
    const row = await this.prisma.branchTable.findUnique({ where: { id } });
    return row ? BranchDbMapper.toDomain(row) : null;
  }

  async findByPublicId(publicId: string): Promise<BranchEntity | null> {
    const row = await this.prisma.branchTable.findUnique({
      where: { public_id: publicId },
    });
    return row ? BranchDbMapper.toDomain(row) : null;
  }

  async findByCode(code: string): Promise<BranchEntity | null> {
    const row = await this.prisma.branchTable.findUnique({ where: { code } });
    return row ? BranchDbMapper.toDomain(row) : null;
  }

  async findWithPagination(
    query: ListBranchQuery,
  ): Promise<{ data: BranchEntity[]; total: number }> {
    const { page, limit, name, code, city, isActive } = query;
    const where: Prisma.BranchTableWhereInput = {};

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (code) {
      where.code = { contains: code, mode: 'insensitive' };
    }
    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }
    if (isActive !== undefined) {
      where.is_active = isActive;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.branchTable.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.branchTable.count({ where }),
    ]);

    return { data: data.map(BranchDbMapper.toDomain), total };
  }

  async delete(publicId: string): Promise<void> {
    await this.prisma.branchTable.delete({ where: { public_id: publicId } });
  }
}
