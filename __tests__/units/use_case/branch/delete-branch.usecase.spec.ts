import { vi } from 'vitest';
import { CodesError } from 'src/application/errors/codes.error';
import { DeleteBranchUseCase } from 'src/application/use_case/branch/delete-branch.usecase';
import { DeleteBranchValidator } from 'src/domain/service/validators/branch/delete-branch.validator';
import { buildBranchEntity } from '../../../helpers/branch.factory';
import { mockBranchRepository } from '../../../helpers/repository.mocks';
import { VALID_PUBLIC_ID } from '../../../helpers/test-constants';

describe('DeleteBranchUseCase', () => {
  const repository = mockBranchRepository();
  const useCase = new DeleteBranchUseCase(repository, new DeleteBranchValidator());

  it('supprime une filiale existante', async () => {
    vi.mocked(repository.findByPublicId).mockResolvedValue(buildBranchEntity());
    vi.mocked(repository.delete).mockResolvedValue();

    await useCase.execute({ publicId: VALID_PUBLIC_ID });

    expect(repository.delete).toHaveBeenCalledWith(VALID_PUBLIC_ID);
  });

  it('lève BRANCH_NOT_FOUND si absente', async () => {
    vi.mocked(repository.findByPublicId).mockResolvedValue(null);

    await expect(useCase.execute({ publicId: VALID_PUBLIC_ID })).rejects.toMatchObject({
      code: CodesError.BRANCH_NOT_FOUND,
    });
  });
});
