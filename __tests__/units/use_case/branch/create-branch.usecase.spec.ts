import { vi } from 'vitest';
import { ApplicationError } from 'src/application/errors/application.error';
import { CodesError } from 'src/application/errors/codes.error';
import { CreateBranchUseCase } from 'src/application/use_case/branch/create-branch.usecase';
import { CreateBranchValidator } from 'src/domain/service/validators/branch/create-branch.validator';
import { buildBranchEntity } from '../../../helpers/branch.factory';
import { buildEmployeeEntity } from '../../../helpers/employee.factory';
import {
  mockBranchRepository,
  mockEmployeeRepository,
  mockPublicIdGenerator,
} from '../../../helpers/repository.mocks';
import { VALID_PUBLIC_ID_2, VALID_UUID_2 } from '../../../helpers/test-constants';

describe('CreateBranchUseCase', () => {
  const branchRepo = mockBranchRepository();
  const employeeRepo = mockEmployeeRepository();
  const idGenerator = mockPublicIdGenerator();
  const validator = new CreateBranchValidator();
  const useCase = new CreateBranchUseCase(
    branchRepo,
    employeeRepo,
    validator,
    idGenerator,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('crée une filiale avec publicId généré', async () => {
    const saved = buildBranchEntity({ publicId: VALID_PUBLIC_ID_2, code: 'YAM' });
    vi.mocked(branchRepo.findByCode).mockResolvedValue(null);
    vi.mocked(branchRepo.save).mockResolvedValue(saved);

    const result = await useCase.execute({ name: 'Filiale Yamoussoukro', code: 'YAM' });

    expect(idGenerator.generateNanoid).toHaveBeenCalled();
    expect(branchRepo.save).toHaveBeenCalled();
    expect(result.publicId).toBe(VALID_PUBLIC_ID_2);
  });

  it('rejette un code déjà utilisé', async () => {
    vi.mocked(branchRepo.findByCode).mockResolvedValue(buildBranchEntity());

    await expect(
      useCase.execute({ name: 'Doublon', code: 'ABJ' }),
    ).rejects.toMatchObject({ code: CodesError.DUPLICATE_BRANCH_CODE });
  });

  it('résout managerPublicId vers manager_id interne', async () => {
    const manager = buildEmployeeEntity({ id: VALID_UUID_2 });
    const saved = buildBranchEntity({ managerId: VALID_UUID_2 });
    vi.mocked(branchRepo.findByCode).mockResolvedValue(null);
    vi.mocked(employeeRepo.findByPublicId).mockResolvedValue(manager);
    vi.mocked(branchRepo.save).mockResolvedValue(saved);

    await useCase.execute({
      name: 'Filiale',
      managerPublicId: manager.publicId,
    });

    expect(employeeRepo.findByPublicId).toHaveBeenCalledWith(manager.publicId);
    const savedEntity = vi.mocked(branchRepo.save).mock.calls[0][0];
    expect(savedEntity.managerId).toBe(VALID_UUID_2);
  });

  it('rejette un managerPublicId inconnu', async () => {
    vi.mocked(branchRepo.findByCode).mockResolvedValue(null);
    vi.mocked(employeeRepo.findByPublicId).mockResolvedValue(null);

    await expect(
      useCase.execute({ name: 'Filiale', managerPublicId: 'x'.repeat(21) }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
});
