import { vi } from 'vitest';
import { ApplicationError } from 'src/application/errors/application.error';
import { CodesError } from 'src/application/errors/codes.error';
import { GetBranchUseCase } from 'src/application/use_case/branch/get-branch.usecase';
import { GetBranchValidator } from 'src/domain/service/validators/branch/get-branch.validator';
import { buildBranchEntity } from '../../../helpers/branch.factory';
import { mockBranchRepository } from '../../../helpers/repository.mocks';
import { VALID_PUBLIC_ID } from '../../../helpers/test-constants';

describe('GetBranchUseCase', () => {
  const repository = mockBranchRepository();
  const useCase = new GetBranchUseCase(repository, new GetBranchValidator());

  it('retourne la filiale trouvée', async () => {
    const entity = buildBranchEntity();
    vi.mocked(repository.findByPublicId).mockResolvedValue(entity);

    const result = await useCase.execute({ publicId: VALID_PUBLIC_ID });
    expect(result?.name).toBe(entity.name);
  });

  it('lève BRANCH_NOT_FOUND si absente', async () => {
    vi.mocked(repository.findByPublicId).mockResolvedValue(null);

    await expect(useCase.execute({ publicId: VALID_PUBLIC_ID })).rejects.toMatchObject({
      code: CodesError.BRANCH_NOT_FOUND,
    });
  });
});
