import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { hasDatabase } from '../../../helpers/test-constants';

describe.skipIf(!hasDatabase)('PrismaService', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.onModuleInit();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('se connecte à la base', async () => {
    const result = await prisma.$queryRaw<{ ok: number }[]>`SELECT 1 as ok`;
    expect(result[0]?.ok).toBe(1);
  });
});
