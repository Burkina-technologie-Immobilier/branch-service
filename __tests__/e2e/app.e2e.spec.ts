import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/app.module';
import { EmployeeRoleEnum } from 'src/domain/enums/employee-role.enum';
import { hasDatabase } from '../helpers/test-constants';

describe.skipIf(!hasDatabase)('Branch Service (e2e)', () => {
  let app: INestApplication<App>;
  let branchPublicId: string;
  let employeePublicId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    if (employeePublicId) {
      await request(app.getHttpServer())
        .delete(`/api/employees/${employeePublicId}`)
        .catch(() => {});
    }
    if (branchPublicId) {
      await request(app.getHttpServer())
        .delete(`/api/branches/${branchPublicId}`)
        .catch(() => {});
    }
    await app.close();
  });

  it('POST /api/branches crée une filiale', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/branches')
      .send({ name: 'E2E Filiale', code: 'E2E', city: 'Abidjan' })
      .expect(200);

    expect(res.body.publicId).toBeDefined();
    expect(res.body.name).toBe('E2E Filiale');
    branchPublicId = res.body.publicId;
  });

  it('GET /api/branches/:publicId retourne la filiale', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/branches/${branchPublicId}`)
      .expect(200);

    expect(res.body.code).toBe('E2E');
  });

  it('POST /api/employees crée un employé rattaché', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/employees')
      .send({
        fullName: 'E2E Employé',
        email: `e2e-${Date.now()}@meublezone.fr`,
        role: EmployeeRoleEnum.VENDEUR,
        branchPublicId,
      })
      .expect(200);

    expect(res.body.branchPublicId).toBe(branchPublicId);
    employeePublicId = res.body.publicId;
  });

  it('GET /api/branches liste les filiales', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/branches')
      .query({ page: 1, limit: 5 })
      .expect(200);

    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
  });
});
