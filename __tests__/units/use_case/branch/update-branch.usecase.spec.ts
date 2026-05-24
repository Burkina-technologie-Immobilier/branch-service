import { vi } from 'vitest';
import { ApplicationError } from 'src/application/errors/application.error';
import { CodesError } from 'src/application/errors/codes.error';
import { UpdateBranchUseCase } from 'src/application/use_case/branch/update-branch.usecase';
import { UpdateBranchValidator } from 'src/domain/service/validators/branch/update-branch.validator';
import { buildBranchEntity } from '../../../helpers/branch.factory';
import {
  mockBranchRepository,
  mockEmployeeRepository,
} from '../../../helpers/repository.mocks';
import { VALID_PUBLIC_ID } from '../../../helpers/test-constants';

describe('UpdateBranchUseCase', () => {
  const branchRepo = mockBranchRepository();
  const employeeRepo = mockEmployeeRepository();
  const useCase = new UpdateBranchUseCase(
    branchRepo,
    employeeRepo,
    new UpdateBranchValidator(),
  );

  it('met à jour une filiale existante', async () => {
    const entity = buildBranchEntity();
    vi.mocked(branchRepo.findByPublicId).mockResolvedValue(entity);
    vi.mocked(branchRepo.save).mockImplementation(async (e) => e);

    const result = await useCase.execute(
      { publicId: VALID_PUBLIC_ID },
      { name: 'Nouveau nom' },
    );

    expect(result.name).toBe('Nouveau nom');
    expect(branchRepo.save).toHaveBeenCalled();
  });

  it('lève BRANCH_NOT_FOUND si absente', async () => {
    vi.mocked(branchRepo.findByPublicId).mockResolvedValue(null);

    await expect(
      useCase.execute({ publicId: VALID_PUBLIC_ID }, { name: 'X' }),
    ).rejects.toMatchObject({ code: CodesError.BRANCH_NOT_FOUND });
  });
});
