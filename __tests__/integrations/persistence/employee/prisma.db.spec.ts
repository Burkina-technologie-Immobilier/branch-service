import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { EmployeeRepositoryAdapter } from 'src/adapter/out/persistence/employee.repository.adapter';
import { EmployeeEntity } from 'src/domain/entities/employee.entity';
import { EmployeeRoleEnum } from 'src/domain/enums/employee-role.enum';
import { hasDatabase } from '../../../helpers/test-constants';
import { nanoid } from 'nanoid';

describe.skipIf(!hasDatabase)('EmployeeRepositoryAdapter (Prisma)', () => {
  let prisma: PrismaService;
  let repository: EmployeeRepositoryAdapter;
  const publicId = nanoid();
  const email = `test-${publicId}@meublezone.fr`;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.onModuleInit();
    repository = new EmployeeRepositoryAdapter(prisma);
  });

  afterAll(async () => {
    await prisma.employeeTable.deleteMany({ where: { public_id: publicId } }).catch(() => {});
    await prisma.$disconnect();
  });

  it('persiste et retrouve un employé par email', async () => {
    const entity = new EmployeeEntity({
      publicId,
      fullName: 'Test Employé',
      email,
      role: EmployeeRoleEnum.SUPPORT,
      isActive: true,
    });

    const saved = await repository.save(entity);
    expect(saved.id).toBeDefined();

    const found = await repository.findByEmail(email);
    expect(found?.fullName).toBe('Test Employé');
    expect(found?.role).toBe(EmployeeRoleEnum.SUPPORT);
  });
});
