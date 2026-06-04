import { vi } from 'vitest';
import { CodesError } from 'src/application/errors/codes.error';
import { CreateEmployeeUseCase } from 'src/application/use_case/employee/create-employee.usecase';
import { CreateEmployeeValidator } from 'src/domain/service/validators/employee/create-employee.validator';
import { EmployeeRoleEnum } from 'src/domain/enums/employee-role.enum';
import { buildBranchEntity } from '../../../helpers/branch.factory';
import { buildEmployeeEntity } from '../../../helpers/employee.factory';
import {
  mockBranchRepository,
  mockEmployeeRepository,
  mockPublicIdGenerator,
} from '../../../helpers/repository.mocks';
import { createTestAccessGuard, createTestEmployeeRolePolicy } from '../../../helpers/access-guard.mock';
import {
  VALID_EMAIL,
  VALID_PUBLIC_ID_2,
  VALID_UUID,
} from '../../../helpers/test-constants';

describe('CreateEmployeeUseCase', () => {
  const employeeRepo = mockEmployeeRepository();
  const branchRepo = mockBranchRepository();
  const idGenerator = mockPublicIdGenerator();
  const useCase = new CreateEmployeeUseCase(
    employeeRepo,
    branchRepo,
    new CreateEmployeeValidator(),
    idGenerator,
    createTestAccessGuard(),
    createTestEmployeeRolePolicy(),
  );

  beforeEach(() => vi.clearAllMocks());

  it('crée un employé', async () => {
    const saved = buildEmployeeEntity({ publicId: VALID_PUBLIC_ID_2 });
    vi.mocked(employeeRepo.findByEmail).mockResolvedValue(null);
    vi.mocked(employeeRepo.save).mockResolvedValue(saved);

    const result = await useCase.execute({
      fullName: 'Jean Dupont',
      email: VALID_EMAIL,
      role: EmployeeRoleEnum.VENDEUR,
    });

    expect(result.publicId).toBe(VALID_PUBLIC_ID_2);
    expect(employeeRepo.save).toHaveBeenCalled();
  });

  it('rejette un email déjà utilisé', async () => {
    vi.mocked(employeeRepo.findByEmail).mockResolvedValue(buildEmployeeEntity());

    await expect(
      useCase.execute({
        fullName: 'Jean',
        email: VALID_EMAIL,
        role: EmployeeRoleEnum.VENDEUR,
      }),
    ).rejects.toMatchObject({ code: CodesError.EMAIL_ALREADY_EXISTS });
  });

  it('résout branchPublicId vers branch_id interne', async () => {
    const branch = buildBranchEntity({ id: VALID_UUID });
    vi.mocked(employeeRepo.findByEmail).mockResolvedValue(null);
    vi.mocked(branchRepo.findByPublicId).mockResolvedValue(branch);
    vi.mocked(employeeRepo.save).mockImplementation(async (e) => e);

    await useCase.execute({
      fullName: 'Jean',
      email: 'autre@meublezone.fr',
      role: EmployeeRoleEnum.MANAGER,
      branchPublicId: branch.publicId,
    });

    const saved = vi.mocked(employeeRepo.save).mock.calls[0][0];
    expect(saved.branchId).toBe(VALID_UUID);
  });
});
