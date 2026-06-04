import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { BranchRepositoryAdapter } from 'src/adapter/out/persistence/branch.repository.adapter';
import { BranchEntity } from 'src/domain/entities/branch.entity';
import { hasDatabase } from '../../../helpers/test-constants';
import { nanoid } from 'nanoid';

describe.skipIf(!hasDatabase)('BranchRepositoryAdapter (Prisma)', () => {
  let prisma: PrismaService;
  let repository: BranchRepositoryAdapter;
  const publicId = nanoid();

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.onModuleInit();
    repository = new BranchRepositoryAdapter(prisma);
  });

  afterAll(async () => {
    await prisma.branchTable.deleteMany({ where: { public_id: publicId } }).catch(() => {});
    await prisma.$disconnect();
  });

  it('persiste et retrouve une filiale par publicId', async () => {
    const entity = new BranchEntity({
      publicId,
      code: `T${publicId.slice(0, 7)}`,
      name: 'Test Filiale',
      isActive: true,
    });

    const saved = await repository.save(entity);
    expect(saved.id).toBeDefined();

    const found = await repository.findByPublicId(publicId);
    expect(found?.name).toBe('Test Filiale');
    expect(found?.code).toBe(entity.code);
  });
});
