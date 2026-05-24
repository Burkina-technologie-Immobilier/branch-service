import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { BranchRepositoryAdapter } from 'src/adapter/out/persistence/branch.repository.adapter';
import { EmployeeRepositoryAdapter } from 'src/adapter/out/persistence/employee.repository.adapter';
import { PublicIdGeneratorAdapter } from 'src/adapter/in/generate-public-id/generate.public-id.adapter';
import { CreateBranchUseCase } from 'src/application/use_case/branch/create-branch.usecase';
import { GetBranchUseCase } from 'src/application/use_case/branch/get-branch.usecase';
import { DeleteBranchUseCase } from 'src/application/use_case/branch/delete-branch.usecase';
import { CreateBranchValidator } from 'src/domain/service/validators/branch/create-branch.validator';
import { GetBranchValidator } from 'src/domain/service/validators/branch/get-branch.validator';
import { DeleteBranchValidator } from 'src/domain/service/validators/branch/delete-branch.validator';
import { hasDatabase } from '../../../helpers/test-constants';
import { nanoid } from 'nanoid';

describe.skipIf(!hasDatabase)('Branch use cases (integration)', () => {
  let prisma: PrismaService;
  let branchRepo: BranchRepositoryAdapter;
  let employeeRepo: EmployeeRepositoryAdapter;
  let publicId: string;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.onModuleInit();
    branchRepo = new BranchRepositoryAdapter(prisma);
    employeeRepo = new EmployeeRepositoryAdapter(prisma);
  });

  afterAll(async () => {
    if (publicId) {
      await prisma.branchTable.deleteMany({ where: { public_id: publicId } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  it('crée puis récupère puis supprime une filiale', async () => {
    const create = new CreateBranchUseCase(
      branchRepo,
      employeeRepo,
      new CreateBranchValidator(),
      new PublicIdGeneratorAdapter(),
    );
    const get = new GetBranchUseCase(branchRepo, new GetBranchValidator());
    const del = new DeleteBranchUseCase(branchRepo, new DeleteBranchValidator());

    const code = `I${nanoid().slice(0, 7)}`;
    const created = await create.execute({ name: 'Intégration Filiale', code });
    publicId = created.publicId;

    const found = await get.execute({ publicId });
    expect(found?.code).toBe(code);

    await del.execute({ publicId });
    publicId = '';
    await expect(get.execute({ publicId: created.publicId })).rejects.toThrow();
  });
});
